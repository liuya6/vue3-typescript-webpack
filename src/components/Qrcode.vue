<template>
  <div id="qr"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import QRCode from "qrcodejs2";

export default defineComponent({
  name: "Qrcode",

  props: {
    text: String,
    width: String,
    height: String,
  },

  mounted() {
    this.$nextTick(() => {
      new QRCode("qr", {
        text: this.$props.text,
        width: Number(this.$props.width),
        height: Number(this.$props.height),
      });
    });
  },
});
</script>

<style scoped></style>
