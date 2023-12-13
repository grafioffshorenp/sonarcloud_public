<template>
  <div
    @click="togglePopover"
    v-click-outside="handleClickOutside"
    class="info-button"
    :class="{ 'popover--active': isActive }">
    <span class="popover__trigger">i</span>
    <ul class="popover__menu">
      <li class="popover__menu-item"><div class="message">{{ $t(text) }}</div></li>
    </ul>
  </div>
</template>

<script>
// Directive for closing the Popover when clicked outside of that Popover
// import { ClickOutside } from "../../../directives/ClickOutside.js";

export default {
  name: "InfoButton",
  props: {
    handle: {
      required: true,
      type: String
    },
    text: {
      type: String
    }
  },
  directives: {
    // ClickOutside
  },
  data() {
    return {
      isActive: false,
    }
  },
  methods: {
    // Open the Popover after we click on an "i" button
    // If we click the "i" button again - close the Popover
    togglePopover() { this.isActive = !this.isActive },

    // Wherever we click (outside the "i" button) - close the Popover
    closePopover() { this.isActive = false },
    handleClickOutside() { this.isActive = false }
  }
}
</script>

<style lang="scss" scoped>
.info-button {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 30px;
  width: 30px;
  line-height: 20px;
  // margin-top: 30px;

  -moz-border-radius: 15px; /* or 50% */
  border-radius: 15px; /* or 50% */

  background-color: white;
  color: black;
  border: 2px solid black;
  text-align: center;
  font-size: 1.5em;
  font-style: italic;
  font-family: serif;
  font-weight: bold;

  cursor: pointer;

  position: absolute;
  top: -45px;
  right: 0;
  z-index: 2;
}


// POPOVER
$radius: 4px;
$accent: #dd6a00;

.popover {
	display: inline-block;
	position: relative;
}

.popover__menu {
  font-family: 'Verdana';
  font-style: normal;
  font-size: 0.7em;
  font-weight: normal;
  color: black;
	border-radius: $radius;
	border: thin solid $accent;
	background: #fff;
	list-style-type: none;
	margin: 8px 0;
	min-width: 100%;
	// padding: 0.2rem 0;
	position: absolute;
	bottom: 25px;
	right: 0;
	box-shadow: 0 2px 3px 0 rgba(63, 63, 68, 0.2);
  z-index: 2;
	
	transition-property: transform, opacity;
	transition-duration: 200ms;
	transition-timing-function: ease;
	
	transform: scale(0.9);
	transform-origin: bottom center;
	display: none;
	opacity: 0;

	&:after {
		bottom: -14px;
		right: 5px;
		border: solid transparent;
		content: " ";
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
		border-color: rgba(255, 255, 255, 0);
		border-bottom-color: $accent;
		border-width: 7px;
    transform: rotate(180deg);
	}
}

.popover__menu-item {
	white-space: pre-wrap;
	div.message  {
		border: 0;
		border-radius: 0;
		width: 250px;
		text-align: left;
    padding: 5px 10px;
    // overflow-wrap: anywhere;

    max-height: 150px;
    overflow-y: auto;
    flex-wrap: wrap;

		&:hover,
		&:focus {
			background-color: #f1f1f1;
		}
	}

  @media only screen and (min-width: 200px) {
    div.message  {
      width: 200px;
    }
  }

  @media only screen and (min-width: 400px) {
    div.message  {
      width: 300px;
    }
  }

  @media only screen and (min-width: 600px) {
    div.message  {
      width: 400px;
    }
  }

  @media only screen and (min-width: 800px) {
    div.message  {
      width: 500px;
    }
  }
}

.popover--active .popover__menu {
	transform: scale(1);
	display: block;
	opacity: 1;
}
</style>