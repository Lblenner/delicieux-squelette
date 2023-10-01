<script lang="ts">
	import RoomList from './RoomList.svelte';
	import JoinButton from './JoinButton.svelte';
</script>

<div class="flex flex-col flex-1 items-center gap-4">
	<div class="mt-4">Salles publics</div>
	<RoomList />
	<JoinButton />
</div>
