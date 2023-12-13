<template>
	
	<div>
		<pre>{{ data }}</pre>
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