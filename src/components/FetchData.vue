<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th @click="sortByColumn('location')">Place</th>
          <th @click="sortByColumn('legislation')">Legislation</th>
          <th @click="sortByColumn('caseLaw')">Case Law</th>
          <th @click="sortByColumn('gazette')">Gazettes</th>
          <th @click="sortByColumn('score')">Score</th>
        </tr>
      </thead>
      <tbody v-for="(access, access_index) in lawIndex" :key="access_index">
        <tr @click="toggleAccordion">
          <td>{{ access_index + 1 }}</td>
          <td>{{ access.location }}</td>
          <td>{{ Math.floor((access.legislation.total * 100) / 70) }}%</td>
          <td>{{ Math.floor((access.caseLaw.total * 100) / 60) }}%</td>
          <td>{{ Math.floor((access.gazette.total * 100) / 60) }}%</td>
          <td>{{ access.score }}%</td>
        </tr>

        <tr class="accordion-body">
          <td></td>
          <td colspan="5">
            <div>
              <p>{{ access.location }}</p>
              <table>
                <thead>
                  <tr>
                    <th>Legislation</th>
                    <th>{{ access.legislation.website }}</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(legislation, legislation_index) in access
                      .legislation.childrenArray"
                    :key="legislation_index"
                  >
                    <td>{{ legislation.cat }} {{ legislation.criterion }}</td>
                    <td>{{ legislation.comments }}</td>
                    <td>{{ legislation.score }}</td>
                  </tr>
                  <tr>
                    <td>TOTAL</td>
                    <td></td>
                    <td>{{ access.legislation.total }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
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
        console.log(lawData);
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
        const newObj: { [key: string]: any } = {
          location: country,
          legislation: this.sortAccordionData(arr, "1.", country),
          caseLaw: this.sortAccordionData(arr, "2.", country),
          gazette: this.sortAccordionData(arr, "3.", country),
        };
        newObj.score = Math.floor(
          (newObj.legislation.total * 100 +
            newObj.caseLaw.total * 100 +
            newObj.gazette.total * 100) /
            190
        );
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
    sortByColumn(field: string) {
      if (field === "location")
        this.lawIndex.sort((a, b) => {
          const locationA = a.location.toLowerCase();
          const locationB = b.location.toLowerCase();
          if (locationA < locationB) {
            return -1;
          }
          if (locationA > locationB) {
            return 1;
          }
          return 0;
        });
      else if (field === "score")
        this.lawIndex.sort((a, b) => a[field] - b[field]);
      else this.lawIndex.sort((a, b) => a[field].total - b[field].total);
    },
    toggleAccordion(e: any) {
      const accordionBody = e.target.parentElement.nextElementSibling;

      if (accordionBody.style.display === "none") {
        accordionBody.style.display = "table-row";
      } else {
        accordionBody.style.display = "none";
      }
    },
  },
};
</script>

<style>
table {
  border-collapse: collapse;
  border: 1px solid black;
  text-align: center;
  vertical-align: middle;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
}

thead th {
  width: 25%;
}

.accordion-body {
  display: none;
}
</style>
