<template>
  <div></div>
</template>

<script lang="ts">
export default {
  name: "FetchData",
  data() {
    return {
      lawIndex: [] as { [key: string]: any }[],
    };
  },
  mounted() {
    this.fetchIndex();
  },
  methods: {
    async fetchIndex() {
      let response = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vToqs8Oyz-t2FyHSHAmoqBvFiaR90j2L0XRysS_Wc7IaK6ZVdEhWRDo_jFJNdLqS-1W-OS00UxmLsCg/pub?gid=1585265851&single=true&output=csv"
      );

      if (response.ok) {
        let json = this.convertToJson(await response.text());
        console.log(json);
        this.lawIndex = json;
      } else {
        console.log("HTTP-Error: " + response.status);
      }
    },
    convertToJson(str: string) {
      let data = str.split("\r\n").map((i) => i.split(/,(?=\S)/));
      let headers = data.shift() || [];
      let output = data.map((d) => {
        let obj: { [key: string]: any } = {};
        headers.map((h, i) => (obj[headers[i]] = d[i]));
        return obj;
      });
      return output;
    },
  },
};
</script>
