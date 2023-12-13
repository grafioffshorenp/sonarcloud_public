<template>
	<article class="c-text-with-image">
		<div class="c-text-with-image__background c-text-with-image__background--image-left"></div>
		<div class="l-container">
			<div class="c-text-with-image__inner c-text-with-image__inner--image-left ">
				<div class="c-text-with-image__content rtl">
					<h2 class="c-text-with-image__title t-title-2 t-title-2--large" v-if="data.blockTitle"
						v-html="$t(data.blockTitle)"></h2>
					<div class="c-text-with-image__text" v-if="data.text">
						<span class="t-text">
							<span v-html="$t(data.text)"></span>
						</span>
					</div>

					<div class="c-text-with-image__button-container" v-if="data.button && data.button.length > 0">
						<template v-for="button in data.button">
							<template v-if="button.buttonLink">
								<NuxtLink v-if="button.buttonLink.url" :to="localePath(usePath().getSlug(button.buttonLink.url))"
									class="c-btn c-btn--fixed-width">
									{{ $t(button.buttonLink.text) }}
								</NuxtLink>
								<div v-else v-html="button.buttonLink.link" class="c-btn c-btn--fixed-width"></div>
							</template>
						</template>
					</div>
				</div>
				<div class="c-text-with-image__image-container c-text-with-image__image-container--image-left" v-if="data.image && data.image.length > 0">
					<picture class="image c-text-with-image__image">
						<!-- <source type="image/webp"
							srcset="https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_375x251_crop_center-center_80_none/43162/Wijchen07.webp 375w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_750x501_crop_center-center_80_none/43162/Wijchen07.webp 750w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_1200x801_crop_center-center_80_none/43162/Wijchen07.webp 1200w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_1500x1001_crop_center-center_80_none/43162/Wijchen07.webp 1500w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_1920x1281_crop_center-center_80_none/43162/Wijchen07.webp 1920w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_2400x1601_crop_center-center_80_none/43162/Wijchen07.webp 2400w"
							sizes="(max-width: 768px) 100vw, 1440px">
						<source type="image/jpg"
							srcset="https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_375x251_crop_center-center_80_none/Wijchen07.jpg 375w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_750x501_crop_center-center_80_none/Wijchen07.jpg 750w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_1200x801_crop_center-center_80_none/Wijchen07.jpg 1200w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_1500x1001_crop_center-center_80_none/Wijchen07.jpg 1500w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_1920x1281_crop_center-center_80_none/Wijchen07.jpg 1920w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_2400x1601_crop_center-center_80_none/Wijchen07.jpg 2400w"
							sizes="(max-width: 768px) 100vw, 1440px"> -->
						<img class="c-text-with-image__image__inner"
							:src="data.image[0].url"
							:alt="data.image[0].title || 'text with image'" title="" style="" loading="lazy" decoding="async">
					</picture>
				</div>
			</div>
		</div>
	</article>
</template>

<script setup>

const props = defineProps({
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

<style lang="scss">
$component: 'c-text-with-image';

.#{$component} {
	&__title {
		p {
			color: $blue;
		}
	}
}

</style>