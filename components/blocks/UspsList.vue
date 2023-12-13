<template>
	<div class="l-container">
		<div class="l-grid">
			<div class="c-usps-list" v-if="data.items && data.items.length > 0">
				<div class="c-usps-list__item" v-for="item in data.items">
					<div class="c-usps-list__image" v-if="item.image && item.image.length > 0">
						<img :src="item.image[0].url" :alt="item.image[0].title || 'USP afbeelding'">
					</div>
					<div class="c-usps-list__content rtl">
						<div class="c-usps-list__title" v-if="item.blockTitle">
							<h2 class="t-title-2 t-title-2--teal t-title-2--higlight" v-html="item.blockTitle">
							</h2>
						</div>
						<div class="t-text t-text--grey" v-if="item.blockText" v-html="item.blockText"></div>
					</div>
				</div>
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

</script>