import { json } from '@sveltejs/kit';
import { createAdminClient } from '$lib/pocketbase/index';
import { serializeNonPOJOs } from '$lib/utils';



export async function POST({ locals, request }) {
    const { username, version } = await request.json(); // Get the username from the request body
    
    // Create the admin client for PocketBase
    const adminClient = await createAdminClient();
    const record = serializeNonPOJOs(await locals.pb.collection('users').getOne(locals.user.id));
    try {

        if (record.MaxPbInstances <= 0) {
            const responseToken = new Response(JSON.stringify({ error: 'สร้างได้สูงสุด 2 รายการเท่านั้น' }), {
                status: 501,
                headers: {
                    'content-type': 'application/json'
                }
            });

            return responseToken;
        }

        const resultList = await adminClient.collection('userPbInstance').getList(1, 1, { sort: '-created' });
        console.log(serializeNonPOJOs(resultList?.items[0].Code));
        const port = resultList?.items[0].Code + 1;
        // Step 1: Create the instance via your backend
        const response = await fetch('https://i18jk.saas.in.th/create-instance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, port, version}),
        });

        if (!response.ok) {
            const errorBody = await response.text(); // Get the error response body
            throw new Error(`Error: ${response.statusText} - ${errorBody}`);
        }

        const instanceData = await response.json(); // Parse the response data
        
        // Step 2: Save instance data to PocketBase
        const records = await adminClient.collection('userPbInstance').create({
            instanceName: username,
            url: `http://${username}.saas.in.th`, // Construct the URL dynamically
            user: locals.user.id,
            Code: port,
            versionPb: version,
        });

        if (record.MaxPbInstances >= 1) {
            const MaxPbInstances = (await record.MaxPbInstances) - 1;
            await adminClient.collection('users').update(locals.user.id, { MaxPbInstances });
        }

        console.log('PocketBase record created:', record);

        // Step 4: Return the combined response data
        return json({
            message: 'Instance created and stored successfully',
            instanceData,
            pocketbaseResponse: records,
        });
    } catch (error) {
        console.error('Error creating instance or saving to PocketBase:', error);
        return json({ error: error.message }, { status: 500 }); // Return an error response
    }
}