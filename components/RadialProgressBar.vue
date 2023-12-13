<template>
  <div class="radial-progress-container" :style="containerStyle">
    <div class="radial-progress-inner" :style="innerCircleStyle">
      <slot />
    </div>

    <svg
      class="radial-progress-bar"
      :width="diameter"
      :height="diameter"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        :r="innerCircleRadius"
        :cx="radius"
        :cy="radius"
        fill="transparent"
        :stroke="unfilledColor"
        :stroke-dasharray="circumference"
        stroke-dashoffset="0"
        stroke-linecap="round"
        :style="strokeStyle"
      />
      <circle
        :transform="'rotate(-90, ' + radius + ',' + radius + ')'"
        :r="innerCircleRadius"
        :cx="radius"
        :cy="radius"
        fill="transparent"
        stroke="#2395D3"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference"
        stroke-linecap="round"
        :style="progressStyle"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "RadialProgressBar",
  props: {
    diameter: {
      type: Number,
      required: false,
      default: 200
    },
    percentage: {
      type: Number,
      required: true
    },
    startColor: {
      type: String,
      required: false,
      default: "#4c0051"
    },
    secondColor: {
      type: String,
      required: false,
      default: null
    },
    thirdColor: {
      type: String,
      required: false,
      default: null
    },
    stopColor: {
      type: String,
      required: false,
      default: "#ff714c"
    },
    strokeWidth: {
      type: Number,
      required: false,
      default: 10
    },
    innerStrokeWidth: {
      type: Number,
      required: false,
      default: 10
    },
    unfilledColor: {
      type: String,
      required: false,
      default: "rgba(0, 0, 0, .1)"
    }
  },
  data() {
    return {
      currentAngle: 0,
      gradient: {
        fx: 1,
        fy: 0.5,
        cx: 0.5,
        cy: 0.5,
        r: 0.65
      },
      strokeDashoffset: null
    };
  },
  computed: {
    radius() {
      return this.diameter / 2;
    },
    circumference() {
      return Math.PI * this.innerCircleDiameter;
    },
    circleSlice() {
      return (2 * Math.PI) / 100;
    },
    innerCircleDiameter() {
      return this.diameter - this.innerStrokeWidth * 2;
    },
    innerCircleRadius() {
      return this.innerCircleDiameter / 2;
    },
    containerStyle() {
      return {
        height: `${this.diameter}px`,
        width: `${this.diameter}px`
      };
    },
    progressStyle() {
      return {
        height: `${this.diameter}px`,
        width: `${this.diameter}px`,
        strokeWidth: `${this.strokeWidth}px`,
        strokeDashoffset: this.strokeDashoffset,
        transition: `stroke-dashoffset 1000ms ease`
      };
    },
    strokeStyle() {
      return {
        height: `${this.diameter}px`,
        width: `${this.diameter}px`,
        strokeWidth: `${this.innerStrokeWidth}px`
      };
    },
    innerCircleStyle() {
      return {
        width: `${this.innerCircleDiameter}px`
      };
    }
  },
  mounted() {
    setTimeout(() => this.changeProgress(), 500);
  },
  methods: {
    getPointOfCircle(angle) {
      const radius = 0.5;
      const x = radius + radius * Math.cos(angle);
      const y = radius + radius * Math.sin(angle);
      return { x, y };
    },
    gotoPoint() {
      const point = this.getPointOfCircle(this.currentAngle);

      if (point.x && point.y) {
        this.gradient.fx = point.x;
        this.gradient.fy = point.y;
      }
    },
    changeProgress() {
      this.strokeDashoffset = ((100 - this.percentage) / 100) * this.circumference;
      this.currentAngle = this.percentage * this.circleSlice;
      this.gotoPoint();
    }
  }
};
</script>

<style lang="scss" scoped>
.radial-progress-container {
  position: relative;
}

.radial-progress-inner {
  align-items: center;
  border-radius: 50%;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0;
  margin: 0 auto;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
