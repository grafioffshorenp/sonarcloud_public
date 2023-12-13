<template>
	<section class="c-slider" v-if="data.slides && data.slides.length > 0">
		<div class="c-slider__track" data-glide-el="track">
			<ul class="c-slider__slides">
				<li v-for="(item, index) in data.slides" :key="'slide_' + index" class="c-slider__slide">
					<article class="c-text-with-image c-text-with-image--no-margin">
						<div class="c-text-with-image__background c-text-with-image__background--image-right"></div>
						<div class="l-container">
							<div
								class="c-text-with-image__inner c-text-with-image__inner--image-right c-text-with-image__inner--text-large">
								<div class="c-text-with-image__content rtl">
									<h2 class="c-text-with-image__title t-title-2 t-title-2--large" v-if="item.slideTitle"
										v-html="item.slideTitle"></h2>
								</div>
								<div v-if="item.image && item.image.length > 0"
									class="c-text-with-image__image-container c-text-with-image__image-container--image-right">
									<picture class="image c-text-with-image__image">
										<!-- <source type="image/webp"
											srcset="https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_375x248_crop_center-center_80_none/19448/loodgieter.webp 375w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_750x496_crop_center-center_80_none/19448/loodgieter.webp 750w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_1200x794_crop_center-center_80_none/19448/loodgieter.webp 1200w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_1500x992_crop_center-center_80_none/19448/loodgieter.webp 1500w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_1920x1270_crop_center-center_80_none/19448/loodgieter.webp 1920w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_2400x1588_crop_center-center_80_none/19448/loodgieter.webp 2400w"
											sizes="(max-width: 768px) 100vw, 1440px">
										<source type="image/png"
											srcset="https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_375x248_crop_center-center_80_none/loodgieter.png 375w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_750x496_crop_center-center_80_none/loodgieter.png 750w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_1200x794_crop_center-center_80_none/loodgieter.png 1200w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_1500x992_crop_center-center_80_none/loodgieter.png 1500w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_1920x1270_crop_center-center_80_none/loodgieter.png 1920w, https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_2400x1588_crop_center-center_80_none/loodgieter.png 2400w"
											sizes="(max-width: 768px) 100vw, 1440px"><img
											src="https://np-rw-site-production.s3-eu-west-1.amazonaws.com/_2037x1347_crop_center-center_80_none/loodgieter.png"
											alt="Loodgieter" title="Loodgieter" loading="lazy" decoding="async"
											class="c-text-with-image__image__inner"> -->
										<img :src="item.image[0].url" :alt="item.image[0].title || 'Slider image'"
											class="c-text-with-image__image__inner" loading="lazy" decoding="async">
									</picture>
								</div>
							</div>
						</div>
					</article>
				</li>
			</ul>
		</div>
		<div class="c-slider__nav" data-glide-el="controls">
			<button data-glide-dir="<" class="c-slider__control-btn"><i class="fas fa-arrow-left" /></button>
			<button data-glide-dir=">" class="c-slider__control-btn"><i class="fas fa-arrow-right" /></button>
		</div>
		<div class="c-slider__bullets" data-glide-el="controls[nav]">
			<button v-for="(item, index) in data.slides" :key="'bullet_' + index" class="c-slider__bullet"
				:data-glide-dir="'=' + index"></button>
		</div>
	</section>
</template>
	
<script setup>
import Glide from "@glidejs/glide";

let glide;

defineProps({
	data: {
		type: Object,
		default: null,
		required: true,
	}
})

onBeforeMount(() => {
	glide = new Glide(".c-slider", {
		type: "carousel",
		gap: 0,
		rewind: false,
		focusAt: "center",
		perView: 1
	});
})

onMounted(() => {
	glide.mount();
})

</script>