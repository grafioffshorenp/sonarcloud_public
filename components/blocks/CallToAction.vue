<template>
	<div>
		<!-- <h1>{{ data.blockTitle }}</h1> -->
		<!-- <div v-html="data.text"></div> -->
		<div class="c-cta c-cta--spaced rtl" v-if="data.button && data.button.length > 0 && data.button[0].buttonLink">
			<div class="c-cta__button">
				<template v-for="button in data.button">
					<NuxtLink v-if="stripDownButton(button.buttonLink.link)" class="c-btn c-btn--fixed-width"
						target="1" :to="localePath(stripDownButton(button.buttonLink.link).href)">
						{{ $t(stripDownButton(button.buttonLink.link).linkLabel) }}
					</NuxtLink>
					<div v-else v-html="button.buttonLink.link"></div>
				</template>
			</div>
		</div>
	</div>
</template>
	
<script setup>

defineProps({
	data: {
		type: Object,
		default: null,
		required: true,
	}
})

const stripDownButton = (val) => {
	const matches = val && val.match(/href="([^"]*)"[^>]*>(.*?)<\/a>/);

	if (matches) {
		// Extracted href and link label
		const [_, href, linkLabel] = matches;
		// Create an object with href and link label
		return { href, linkLabel };
	}
	//if the api data difers from the above logic the response can handled here..
	return {};
}

</script>