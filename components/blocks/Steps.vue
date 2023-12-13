<template>
	<section class="c-steps rtl">
		<div class="l-container">
			<div class="c-steps__inner">
				<header class="c-steps__header">
					<h2 class="c-steps__title t-title-2" v-if="data.blockTitle">{{ data.blockTitle }}</h2>
					<p class="c-steps__subtitle t-text" v-if="data.blockSubtitle">{{ data.blockSubtitle }}</p>
				</header>
				<ul class="c-steps__list" v-if="data.steps && data.steps.length > 0">
					<li class="c-steps__list-item" v-for="item in data.steps">
						<div class="c-steps__list-item-icon-container" v-if="item.icon && item.icon.length > 0">
							<img class="c-steps__list-item-icon" :src="icon.url" :atl="icon.title"
								v-for="icon in item.icon">
						</div>
						<h3 class="c-steps__list-item-title t-title-3" v-if="item.stepTitle">{{ item.stepTitle }}</h3>
						<p class="c-steps__list-item-text t-text" v-if="item.text">{{ item.text }}</p>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>
	
<script setup>

defineProps({
	data: {
		type: Object,
		default: null,
		required: true,
	}
});

</script>