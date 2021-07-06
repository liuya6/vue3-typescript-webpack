<template>
  <div id="qr"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, nextTick } from "vue";

import QRCode from "qrcodejs2";

export default defineComponent({
  name: "Qrcode",

  props: {
    text: String,
    width: String,
    height: String,
  },

  setup(props) {
    onMounted(() => {
      nextTick(() => {
        new QRCode("qr", {
          text: props.text,
          width: Number(props.width),
          height: Number(props.height),
        });
      });
    });
  },
});
</script>

<style scoped></style>
