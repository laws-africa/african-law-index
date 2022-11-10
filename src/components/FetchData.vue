<template>
  <div>
    <!-- <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Place</th>
          <th>Legislation</th>
          <th>Case Law</th>
          <th>Gazettes</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table> -->
  </div>
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
        const lawData = this.getPointsPerCountry(json);
        console.log(json, lawData);
        this.lawIndex = lawData;
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
    findObject(arr: any[], value: any, country: string | number) {
      const foundArr = arr.find((obj) => obj.Cat == value);
      if (foundArr) return foundArr[country];
      return "";
    },
    getPointsPerCountry(arr: any[]) {
      const firstObj = arr[0];
      const formattedArray = Object.keys(firstObj).filter(
        (key) =>
          key !== "Cat" &&
          key !== "Criterion" &&
          key !== "Comments" &&
          key !== "points"
      );
      const newArray = formattedArray.map((country) => {
        const newObj = {
          location: country,
          legislation: this.sortAccordionData(arr, "1.", country),
          caseLaw: this.sortAccordionData(arr, "2.", country),
          gazette: this.sortAccordionData(arr, "3.", country),
        };
        return newObj;
      });
      return newArray;
    },
    sortAccordionData(arr: any[], filterValue: string, country: string) {
      const objToReturn: { [key: string]: any } = {};
      const childrenArray = arr
        .filter((el, index) => {
          if (
            el.Cat.startsWith(filterValue) &&
            arr[index - 1].Cat === "Website"
          ) {
            objToReturn.website = arr[index - 1][country];
          }
          return el.Cat.startsWith(filterValue);
        })
        .map((obj) => {
          const newObj = {
            cat: obj.Cat,
            criterion: obj.Criterion,
            comments: obj.Comments,
            score: obj[country],
          };
          return newObj;
        });
      objToReturn.childrenArray = childrenArray;
      objToReturn.total = this.findObject(arr, parseInt(filterValue), country);

      return objToReturn;
    },
  },
};
</script>
