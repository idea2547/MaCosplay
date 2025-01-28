import { json } from '@sveltejs/kit';
import { createAdminClient } from '$lib/pocketbase/index';
import { serializeNonPOJOs } from '$lib/utils';



export async function POST({ locals, request }) {
    const { Name, Details, clothingSize, selectedRegion } = await request.json(); // Get the username from the request body
    
    // Create the admin client for PocketBase
    const adminClient = await createAdminClient();
    const record = serializeNonPOJOs(await locals.pb.collection('users').getOne(locals.user.id));
    try {


        // Step 1: Create the instance via your backend
        /* const response = await fetch('https://i18jk.saas.in.th/create-instance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, port, version}),
        });

        if (!response.ok) {
            const errorBody = await response.text(); // Get the error response body
            throw new Error(`Error: ${response.statusText} - ${errorBody}`);
        } */

        /* const instanceData = await response.json(); // Parse the response data
         */
        // Step 2: Save instance data to PocketBase
        const records = await adminClient.collection('itemList').create({
            Name: Name,
            user: locals.user.id,
            Details: Details,
            Size: clothingSize,
            Province: selectedRegion,
        });


        console.log('Item create:', record);

        // Step 4: Return the combined response data
        return json({
            message: 'Store created and stored successfully',
            cosplayStore: records,
        });
    } catch (error) {
        console.error('Error creating instance or saving to PocketBase:', error);
        return json({ error: error.message }, { status: 500 }); // Return an error response
    }
}