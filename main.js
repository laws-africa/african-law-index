import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const africanLawIndex = createApp({
  template: `<div class="container">
  <div class="row table-head">
    <div class="col-1">Rank</div>
    <div class="col pointer" @click="sortByColumn('location')">Place</div>
    <div class="col pointer" @click="sortByColumn('legislation')">Legislation</div>
    <div class="col pointer" @click="sortByColumn('caseLaw')">Case Law</div>
    <div class="col pointer" @click="sortByColumn('gazette')">Gazettes</div>
    <div class="col pointer" @click="sortByColumn('score')">Score</div>
  </div>
  <div v-for="(access, access_index) in lawIndex" :key="access_index">
    <div
      class="row  pointer"
      data-toggle="collapse"
      :href="'#' + access.location"
      role="button"
      aria-expanded="false"
      aria-controls="access.location"
    >
      <div class="col-1">{{ access_index + 1 }}</div>
      <div class="col">{{ access.location }}</div>
      <div class="col">
        {{ Math.floor((access.legislation.total * 100) / 70) }}%
      </div>
      <div class="col">
        {{ Math.floor((access.caseLaw.total * 100) / 60) }}%
      </div>
      <div class="col">
        {{ Math.floor((access.gazette.total * 100) / 60) }}%
      </div>
      <div class="col">{{ Math.floor(access.score) }}%</div>
    </div>

    <div class="collapse row" :id="access.location">
      <div class="col-1"></div>
      <div class="col">
        <div>
          <p>{{ access.location }}</p>
          <div class="p-3">
            <div class="row table-head">
              <div class="col">Legislation</div>
              <div class="col"><a :href="access.legislation.website" target="_blank">Description</a></div>
              <div class="col">Points</div>
            </div>
            <div
              class="row"
              v-for="(legislation, legislation_index) in access
                  .legislation.childrenArray"
              :key="legislation_index"
            >
              <div class="col">
                {{ legislation.cat }} {{ legislation.criterion }}
              </div>
              <div class="col">{{ legislation.comments }}</div>
              <div class="col">{{ legislation.score }}</div>
            </div>
            <div class="row">
              <div class="col font-weight-bold">TOTAL</div>
              <div class="col"></div>
              <div class="col font-weight-bold">{{ access.legislation.total }}</div>
            </div>
          </div>

          <div class="p-3">
            <div class="row table-head">
              <div class="col">Case Law</div>
              <div class="col"><a :href="access.caseLaw.website" target="_blank">Description</a></div>
              <div class="col">Points</div>
            </div>
            <div
              class="row"
              v-for="(caseLaw, caseLaw_index) in access
                  .caseLaw.childrenArray"
              :key="caseLaw_index"
            >
              <div class="col">
                {{ caseLaw.cat }} {{ caseLaw.criterion }}
              </div>
              <div class="col">{{ caseLaw.comments }}</div>
              <div class="col">{{ caseLaw.score }}</div>
            </div>
            <div class="row">
              <div class="col font-weight-bold">TOTAL</div>
              <div class="col"></div>
              <div class="col font-weight-bold">{{ access.caseLaw.total }}</div>
            </div>
          </div>

          <div class="p-3">
            <div class="row table-head">
              <div class="col">Gazettes</div>
              <div class="col"><a :href="access.gazette.website" target="_blank">Description</a></div>
              <div class="col">Points</div>
            </div>
            <div
              class="row"
              v-for="(gazette, gazette_index) in access
                  .gazette.childrenArray"
              :key="gazette_index"
            >
              <div class="col">
                {{ gazette.cat }} {{ gazette.criterion }}
              </div>
              <div class="col">{{ gazette.comments }}</div>
              <div class="col">{{ gazette.score }}</div>
            </div>
            <div class="row">
              <div class="col font-weight-bold">TOTAL</div>
              <div class="col"></div>
              <div class="col font-weight-bold">{{ access.gazette.total }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`,
  data() {
    return {
      lawIndex: [],
    };
  },
  mounted() {
    this.fetchLawIndex();
  },
  methods: {
    async fetchLawIndex() {
      let response = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vToqs8Oyz-t2FyHSHAmoqBvFiaR90j2L0XRysS_Wc7IaK6ZVdEhWRDo_jFJNdLqS-1W-OS00UxmLsCg/pub?gid=1585265851&single=true&output=csv"
      );

      if (response.ok) {
        let json = this.convertToJson(await response.text());
        const lawData = this.formatLawIndex(json);
        console.log(lawData);
        this.lawIndex = lawData;
      } else {
        console.log("HTTP-Error: " + response.status);
      }
    },
    convertToJson(str) {
      let data = str.split("\r\n").map((i) => i.split(/,(?=\S)/));
      let headers = data.shift() || [];
      let output = data.map((d) => {
        let obj = {};
        headers.map((h, i) => (obj[headers[i]] = d[i]));
        return obj;
      });
      return output;
    },
    findDataPerCountry(arr, value, country) {
      const foundArr = arr.find((obj) => obj.Cat == value);
      if (foundArr) return foundArr[country];
      return "";
    },
    formatLawIndex(arr) {
      const formattedArray = Object.keys(arr[0]).filter(
        (key) =>
          key !== "Cat" &&
          key !== "Criterion" &&
          key !== "Comments" &&
          key !== "points"
      );
      const newArray = formattedArray.map((country) => {
        const newObj = {
          location: country,
          legislation: this.formatAccordionData(arr, "1.", country),
          caseLaw: this.formatAccordionData(arr, "2.", country),
          gazette: this.formatAccordionData(arr, "3.", country),
        };
        newObj.score =
          ((newObj.legislation.total +
            newObj.caseLaw.total +
            newObj.gazette.total) *
            100) /
          190;
        return newObj;
      });
      return newArray;
    },
    formatAccordionData(arr, filterValue, country) {
      const objToReturn = {};
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
      objToReturn.total = parseInt(
        this.findDataPerCountry(arr, parseInt(filterValue), country)
      );

      return objToReturn;
    },
    sortByColumn(field) {
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
    // toggleAccordion(e) {
    //   const accordionBody = e.target.parentElement.nextElementSibling;

    //   if (accordionBody.style.display === "none") {
    //     accordionBody.style.display = "table-row";
    //   } else {
    //     accordionBody.style.display = "none";
    //   }
    // },
  },
});

africanLawIndex.mount("#african-law-index");
