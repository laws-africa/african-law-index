const { createApp } = Vue;

const africanLawIndex = createApp({
  template: `<div class="container">
    <div v-if="loading" class="center-align">
      <div class="spinner" role="status"></div>
    </div>

    <div class="center-align" v-else-if="!loading && !status">An error occured while loading the data. Please try again later.</div>

    <div v-else>
      <div class="table-row table-head">
        <div class="table-column first-column__main">Rank</div>
        <div class="table-column second-column__main pointer" @click="sortByColumn('location')">Place</div>
        <div class="table-column third-column__main pointer" @click="sortByColumn('legislation')">
          Legislation
        </div>
        <div class="table-column fourth-column__main pointer" @click="sortByColumn('caseLaw')">Case Law</div>
        <div class="table-column fifth-column__main pointer" @click="sortByColumn('gazette')">Gazettes</div>
        <div class="table-column sixth-column__main pointer" @click="sortByColumn('score')">Score</div>
      </div>
      <div v-for="(access, access_index) in lawIndex" :key="access_index">
        <div
          class="table-row accordion-collapse pointer"
          @click="(e) => toggleAccordion(e, access.location)"
        >
          <div class="table-column first-column__main">{{ access_index + 1 }}</div>
          <div class="table-column second-column__main">{{ access.location }}</div>
          <div class="table-column third-column__main">
            {{ Math.floor((access.legislation.total * 100) / 70) }}%
          </div>
          <div class="table-column fourth-column__main">
            {{ Math.floor((access.caseLaw.total * 100) / 60) }}%
          </div>
          <div class="table-column fifth-column__main">
            {{ Math.floor((access.gazette.total * 100) / 60) }}%
          </div>
          <div class="table-column sixth-column__main">{{ Math.floor(access.score) }}%</div>
        </div>

        <div class="dropdown table-row" :id="access.location">
          <div class="table-column first-column__main"></div>
          <div class="table-column second-column__dropdown">
            <div>
              <div>{{ access.location }}</div>
              <div class="dropdown-content">
                <div class="table-row table-head">
                  <div class="table-column first-column__dropdown-content">Legislation</div>
                  <div class="table-column second-column__dropdown-content">
                    <a :href="access.legislation.website" target="_blank">
                      Description
                    </a>
                  </div>
                  <div class="table-column sixth-column__main">Points</div>
                </div>
                <div
                  class="table-row"
                  v-for="(legislation, legislation_index) in access
                    .legislation.criteria"
                  :key="legislation_index"
                >
                  <div class="table-column first-column__dropdown-content">
                    {{ legislation.cat }} {{ legislation.criterion }}
                  </div>
                  <div class="table-column second-column__dropdown-content">{{ legislation.comments }}</div>
                  <div class="table-column sixth-column__main">{{ legislation.score }}</div>
                </div>
                <div class="table-row">
                  <div class="table-column first-column__dropdown-content font-bold">TOTAL</div>
                  <div class="table-column second-column__dropdown-content">{{ access.legislation.comments }}</div>
                  <div class="table-column sixth-column__main font-bold">
                    {{ access.legislation.total }}
                  </div>
                </div>
              </div>

              <div class="dropdown-content">
                <div class="table-row table-head">
                  <div class="table-column first-column__dropdown-content">Case Law</div>
                  <div class="table-column second-column__dropdown-content">
                    <a :href="access.caseLaw.website" target="_blank">
                      Description
                    </a>
                  </div>
                  <div class="table-column sixth-column__main">Points</div>
                </div>
                <div
                  class="table-row"
                  v-for="(caseLaw, caseLaw_index) in access
                    .caseLaw.criteria"
                  :key="caseLaw_index"
                >
                  <div class="table-column first-column__dropdown-content">{{ caseLaw.cat }} {{ caseLaw.criterion }}</div>
                  <div class="table-column second-column__dropdown-content">{{ caseLaw.comments }}</div>
                  <div class="table-column sixth-column__main">{{ caseLaw.score }}</div>
                </div>
                <div class="table-row">
                  <div class="table-column first-column__dropdown-content font-bold">TOTAL</div>
                  <div class="table-column second-column__dropdown-content">{{ access.caseLaw.comments }}</div>
                  <div class="table-column sixth-column__main font-bold">
                    {{ access.caseLaw.total }}
                  </div>
                </div>
              </div>

              <div class="dropdown-content">
                <div class="table-row table-head">
                  <div class="table-column first-column__dropdown-content">Gazettes</div>
                  <div class="table-column second-column__dropdown-content">
                    <a :href="access.gazette.website" target="_blank">
                      Description
                    </a>
                  </div>
                  <div class="table-column sixth-column__main">Points</div>
                </div>
                <div
                  class="table-row"
                  v-for="(gazette, gazette_index) in access
                    .gazette.criteria"
                  :key="gazette_index"
                >
                  <div class="table-column first-column__dropdown-content">{{ gazette.cat }} {{ gazette.criterion }}</div>
                  <div class="table-column second-column__dropdown-content">{{ gazette.comments }}</div>
                  <div class="table-column sixth-column__main">{{ gazette.score }}</div>
                </div>
                <div class="table-row">
                  <div class="table-column first-column__dropdown-content font-bold">TOTAL</div>
                  <div class="table-column second-column__dropdown-content">{{ access.gazette.comments }}</div>
                  <div class="table-column sixth-column__main font-bold">
                    {{ access.gazette.total }}
                  </div>
                </div>
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
      loading: true,
    };
  },
  mounted() {
    this.fetchLawIndex();
  },
  methods: {
    async fetchLawIndex() {
      const response = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vToqs8Oyz-t2FyHSHAmoqBvFiaR90j2L0XRysS_Wc7IaK6ZVdEhWRDo_jFJNdLqS-1W-OS00UxmLsCg/pub?gid=1585265851&single=true&output=csv"
      );

      this.status = response.ok;

      if (response.ok) {
        const json = this.convertToJson(await response.text());
        this.lawIndex = this.formatLawIndex(json);
        this.loading = false;
      } else {
        this.loading = false;
        console.log("HTTP-Error: " + response.status);
      }
    },
    convertToJson(str) {
      const data = str
        .split("\r\n")
        .map((i) => i.replace(/\"/g, "").split(/,(?=\S)/));
      const keys = data.shift();
      return data.map((value) => {
        const keyValuePair = {};
        keys.map((key, i) => (keyValuePair[key] = value[i]));
        return keyValuePair;
      });
    },
    findDataPerKey(arr, value, key) {
      const foundArr = arr.find((obj) => obj.Cat == value);
      return foundArr[key] || "";
    },
    formatLawIndex(arr) {
      // We need to format our jsonOutput so that it's readable and more structured.
      // This helps us populate the table easily.

      // The goal is to sort jsonOutput per country
      // so that each array element contains all relvant info about the specified country.
      
      const countries = Object.keys(arr[0]).filter(
        (key) =>
          key !== "Cat" &&
          key !== "Criterion" &&
          key !== "Comments" &&
          key !== "points"
      );
      return countries.map((country) => {
        const dataPerCountry = {
          location: country,
          legislation: this.formatAccordionData(arr, "1.", country),
          caseLaw: this.formatAccordionData(arr, "2.", country),
          gazette: this.formatAccordionData(arr, "3.", country),
        };
        dataPerCountry.score =
          ((dataPerCountry.legislation.total +
            dataPerCountry.caseLaw.total +
            dataPerCountry.gazette.total) *
            100) /
          190;
        return dataPerCountry;
      });
    },
    formatAccordionData(arr, filterValue, country) {
      const objToReturn = {};
      objToReturn.criteria = arr
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
          const criterionData = {
            cat: obj.Cat,
            criterion: obj.Criterion,
            comments: obj.Comments,
            score: obj[country],
          };
          return criterionData;
        });
      objToReturn.total = parseInt(
        this.findDataPerKey(arr, parseInt(filterValue), country)
      );
      objToReturn.points = parseInt(
        this.findDataPerKey(arr, parseInt(filterValue), "points")
      );
      objToReturn.comments = this.findDataPerKey(
        arr,
        parseInt(filterValue),
        "Comments"
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
    toggleAccordion(e, location) {
      const dropdown = document.querySelector(`#${location}`);

      if (dropdown.style.maxHeight) {
        dropdown.style.maxHeight = null;
      } else {
        dropdown.style.maxHeight = dropdown.scrollHeight + "px";
      }
    },
  },
});

africanLawIndex.mount("#african-law-index");
