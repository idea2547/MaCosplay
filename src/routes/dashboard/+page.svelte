<script lang="ts">
    export let data: { userStore: any[] }; // Define data type
</script>

<section class="p-6">
    <h1 class="text-2xl font-bold mb-4">ร้านค้า Cosplay Store ของคุณ</h1>
    <a href="/create-shop">
        <button class="btn btn-primary mb-4">+ สร้างร้านค้า</button>
    </a>
    
    <p class="mb-4">คุณมี {data.userStore.length} / 1 ร้านค้า</p>
    {#if data.userStore && data.userStore.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each data.userStore as shop}
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">{shop.Name}</h2>
                        <p>รายละเอียด: <a href={shop.Details} class="text-blue-500" target="_blank">{shop.Details}</a></p>
                        <p>UserID: {shop.user || 'N/A'}</p>
                        <p>Created: {new Date(shop.created).toLocaleString()}</p>
                        <a href="/manage-store">
                            <button class="btn btn-secondary mb-4">จัดการร้านค้า</button>
                        </a>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p>ไม่เจอร้านค้า</p>
    {/if}
</section>
