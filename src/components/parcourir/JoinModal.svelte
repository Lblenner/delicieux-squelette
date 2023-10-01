<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { allRooms, joinRoom } from '../appState';
	import type { Room } from '../types';
	import { selectedIndex } from './selectedIndexStore';
	import { goto } from '$app/navigation';

	let room: Room | undefined;
	if (!$allRooms) {
		room = undefined;
	} else {
		if ($selectedIndex === -1) {
			room = undefined;
		} else {
			room = $allRooms[$selectedIndex];
		}
	}

	let modalStore = getModalStore()

	let promise: Promise<void>;
	const click = () => {
		if ($allRooms && $selectedIndex !== -1) {
			promise = joinRoom($allRooms[$selectedIndex]);
			modalStore.close();
			goto('/voir');
		}
	};

	let password: string;
</script>

<div class="w-max-[300px] w-[600px] bg-surface-100-800-token p-4 gap-2 flex flex-col">
	<h2>{room?.name}</h2>

	<p>Resolution : {room?.resolution}</p>

	<p>Colors</p>
	<div class="grid grid-cols-3 gap-2 self-start">
		{#each room?.colors ?? [] as color, i}
			<div class=" w-[40px] h-[20px]" style="background-color : {color};" />
		{/each}
	</div>

	{#if room?.rules}
		<p>Description de la salle :</p>
		<p class="bg-surface-200-700-token p-2 m-2 whitespace-pre-line">
			{room?.rules}
		</p>
	{/if}

	{#if room?.password_protected}
		<label class="label" for="password">
			<span>Mot de passe</span>
			<input class="input" type="password" id="password" bind:value={password} />
		</label>
	{/if}

	{#await promise}
		<div>Load</div>
	{:then _}
		<div class="flex flex-row gap-2">
			<div class="flex-1" />
			<button
				on:click={() => {
					modalStore.close();
				}}
				class="btn variant-filled w-[100px]">Annuler</button
			>
			<button on:click={click} class="btn variant-filled w-[100px]">Rejoindre</button>
		</div>
	{/await}
</div>
