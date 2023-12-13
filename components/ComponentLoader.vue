<template>
	<main id="main" class="general-component-loader">
		<template v-for="(section, index) in data" :key="`${section.__typename}${index}`">
			<component		
				:is="`Blocks${UCFirst(section.__typename)}`"				
				:class="'content-component'"
				:data="section"
				:number="index"
			/>
		</template>
	</main>
</template>

<script setup>
defineProps({
	data: {
		type: Object,
		default: null,
		required: true,
	}
})

const UCFirst = (value) => {
	const formatedValue = value.split('_') || [];
	if (formatedValue && formatedValue[1]) {		
		const camelCase = formatedValue[1].replace(/[_\-]([^_\-])/g, ($0, $1) => $1.toUpperCase());
		return camelCase.charAt(0).toUpperCase() + camelCase.substring(1);
	}
	throw {error: 'unable to parse component block name'};
};
</script>
