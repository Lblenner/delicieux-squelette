<script lang="ts">
	import { hash } from '$lib/hash';
	import { quitRoom, usersRooms } from '../appState';

	export let index: number;

	$: room = $usersRooms[index];
	// let rules = $usersRooms[index].rules;

	// roomChange.set({ rules: $usersRooms[index].rules });
</script>

<div>
	<!-- <label class="label" for="rules">
		<span>Message de la salle</span>
		<textarea
			id="rules"
			class="textarea"
			bind:value={$roomChange.rules}
			rows="4"
			placeholder="petit message pour les gens qui participent au dessin"
		/>
	</label> -->
	<!-- {#if rules !== $roomChange.rules}
		<button class="mt-2 btn w-full variant-filled">modifier le message</button>
	{/if} -->
	{#if room.password && hash(room.password) == room.hashed_password}
		<div class="text-center p-2">
			Mot de passe : {room.password}
		</div>
	{/if}

	{#if room.admin && hash(room.admin) == room.hashed_admin}
		<button
			disabled
			on:click={() => {
				console.log('todooo');
			}}
			class="mt-2 btn w-full variant-filled">supprimer une case (soon)</button
		>
		<button
			disabled
			on:click={() => {
				console.log('todooo');
			}}
			class="mt-2 btn w-full variant-filled">lien de partage (soon)</button
		>
		<div class="text-center p-2">
			Mot de passe admin : {room.admin}
		</div>
		<button on:click={() => quitRoom(room)} class="btn w-full variant-filled"
			>quitter la salle</button
		>
	{:else}
		<button on:click={() => quitRoom(room)} class="btn w-full variant-filled"
			>quitter la salle</button
		>
	{/if}
</div>
