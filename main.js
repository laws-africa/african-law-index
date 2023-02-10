const africanLawIndex = Vue.createApp({
  template: `<div class="law-index__container">
    <div v-if="loading" class="law-index__center-align">
      <div class="law-index__spinner" role="status"></div>
    </div>

    <div class="law-index__center-align" v-else-if="!loading && !status">
      An error occured while loading the data. Please try again later.
    </div>

    <div class="law-index__table" v-else>
      <div class="law-index__table-row law-index__table-head">
        <div
          class="law-index__table-column first-column__main law-index__pointer"
          @click="updateSortValue('rank')"
        >
          Rank <span v-html="displayArrow('rank')"></span>
        </div>
        <div
          class="law-index__table-column second-column__main law-index__pointer"
          @click="updateSortValue('location')"
        >
          Place <span v-html="displayArrow('location')"></span>
        </div>
        <div
          class="law-index__table-column third-column__main law-index__pointer"
          @click="updateSortValue('score')"
        >
          Score <span v-html="displayArrow('score')"></span>
        </div>
        <div
          class="law-index__table-column fourth-column__main law-index__pointer"
          @click="updateSortValue('legislation')"
        >
          Legislation <span v-html="displayArrow('legislation')"></span>
        </div>
        <div
          class="law-index__table-column fifth-column__main law-index__pointer"
          @click="updateSortValue('caseLaw')"
        >
          Case Law <span v-html="displayArrow('caseLaw')"></span>
        </div>
        <div
          class="law-index__table-column last-column__main law-index__pointer"
          @click="updateSortValue('gazette')"
        >
          Gazettes <span v-html="displayArrow('gazette')"></span>
        </div>
      </div>
      <div v-for="(access, access_index) in lawIndex" :key="access_index">
        <div
          class="law-index__table-row law-index_table-accordion law-index__pointer"
          @click="(e) => toggleAccordion(e, access_index)"
        >
          <div class="law-index__table-column first-column__main">
            {{ access.rank }}
          </div>
          <div class="law-index__table-column second-column__main">
            {{ access.location }}
          </div>
          <div class="law-index__table-column third-column__main">
            {{ Math.floor(access.score) }}%
          </div>
          <div class="law-index__table-column fourth-column__main">
            {{ Math.floor((access.legislation.total * 100) / access.legislation.points) }}%
          </div>
          <div class="law-index__table-column fifth-column__main">
            {{ Math.floor((access.caseLaw.total * 100) / access.caseLaw.points) }}%
          </div>
          <div class="law-index__table-column last-column__main">
            {{ Math.floor((access.gazette.total * 100) / access.gazette.points) }}%
          </div>
        </div>

        <div
          class="law-index__dropdown law-index__table-row"
          :id="'table-row__' + access_index"
        >
          <div class="law-index__table-column first-column__main"></div>
          <div class="law-index__table-column second-column__dropdown">
            <div>
              <div>{{ access.location }}</div>
              <div class="law-index__dropdown-content">
                <div class="law-index__table-row law-index__table-head">
                  <div
                    class="law-index__table-column first-column__dropdown-content"
                  >
                    Legislation
                  </div>
                  <div
                    class="law-index__table-column second-column__dropdown-content"
                  >
                    <a :href="access.legislation.website" target="_blank">
                      Description
                    </a>
                  </div>
                  <div class="law-index__table-column last-column__main">
                    Points
                  </div>
                </div>
                <div
                  class="law-index__table-row"
                  v-for="(legislation, legislation_index) in access
                      .legislation.criteria"
                  :key="legislation_index"
                >
                  <div
                    class="law-index__table-column first-column__dropdown-content"
                  >
                    {{ legislation.cat }} {{ legislation.criterion }}
                  </div>
                  <div
                    class="law-index__table-column second-column__dropdown-content"
                  >
                    {{ legislation.comments }}
                  </div>
                  <div class="law-index__table-column last-column__main">
                    {{ legislation.score }}
                  </div>
                </div>
                <div class="law-index__table-row">
                  <div
                    class="law-index__table-column first-column__dropdown-content law-index__font-bold"
                  >
                    TOTAL
                  </div>
                  <div
                    class="law-index__table-column second-column__dropdown-content"
                  >
                    {{ access.legislation.comments }}
                  </div>
                  <div
                    class="law-index__table-column last-column__main law-index__font-bold"
                  >
                    {{ access.legislation.total }} out of {{access.legislation.points}}
                  </div>
                </div>
              </div>

              <div class="law-index__dropdown-content">
                <div class="law-index__table-row law-index__table-head">
                  <div
                    class="law-index__table-column first-column__dropdown-content"
                  >
                    Case Law
                  </div>
                  <div
                    class="law-index__table-column second-column__dropdown-content"
                  >
                    <a :href="access.caseLaw.website" target="_blank">
                      Description
                    </a>
                  </div>
                  <div class="law-index__table-column last-column__main">
                    Points
                  </div>
                </div>
                <div
                  class="law-index__table-row"
                  v-for="(caseLaw, caseLaw_index) in access
                      .caseLaw.criteria"
                  :key="caseLaw_index"
                >
                  <div
                    class="law-index__table-column first-column__dropdown-content"
                  >
                    {{ caseLaw.cat }} {{ caseLaw.criterion }}
                  </div>
                  <div
                    class="law-index__table-column second-column__dropdown-content"
                  >
                    {{ caseLaw.comments }}
                  </div>
                  <div class="law-index__table-column last-column__main">
                    {{ caseLaw.score }}
                  </div>
                </div>
                <div class="law-index__table-row">
                  <div
                    class="law-index__table-column first-column__dropdown-content law-index__font-bold"
                  >
                    TOTAL
                  </div>
                  <div
                    class="law-index__table-column second-column__dropdown-content"
                  >
                    {{ access.caseLaw.comments }}
                  </div>
                  <div
                    class="law-index__table-column last-column__main law-index__font-bold"
                  >
                    {{ access.caseLaw.total }} out of {{access.caseLaw.points}}
                  </div>
                </div>
              </div>

              <div class="law-index__dropdown-content">
                <div class="law-index__table-row law-index__table-head">
                  <div
                    class="law-index__table-column first-column__dropdown-content"
                  >
                    Gazettes
                  </div>
                  <div
                    class="law-index__table-column second-column__dropdown-content"
                  >
                    <a :href="access.gazette.website" target="_blank">
                      Description
                    </a>
                  </div>
                  <div class="law-index__table-column last-column__main">
                    Points
                  </div>
                </div>
                <div
                  class="law-index__table-row"
                  v-for="(gazette, gazette_index) in access
                      .gazette.criteria"
                  :key="gazette_index"
                >
                  <div
                    class="law-index__table-column first-column__dropdown-content"
                  >
                    {{ gazette.cat }} {{ gazette.criterion }}
                  </div>
                  <div
                    class="law-index__table-column second-column__dropdown-content"
                  >
                    {{ gazette.comments }}
                  </div>
                  <div class="law-index__table-column last-column__main">
                    {{ gazette.score }}
                  </div>
                </div>
                <div class="law-index__table-row">
                  <div
                    class="law-index__table-column first-column__dropdown-content law-index__font-bold"
                  >
                    TOTAL
                  </div>
                  <div
                    class="law-index__table-column second-column__dropdown-content"
                  >
                    {{ access.gazette.comments }}
                  </div>
                  <div
                    class="law-index__table-column last-column__main law-index__font-bold"
                  >
                    {{ access.gazette.total }} out of {{access.gazette.points}}
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
      currentSortValue: {
        rank: "",
        location: "",
        legislation: "",
        caseLaw: "",
        gazette: "",
        score: "desc",
      },
    };
  },
  watch: {
    currentSortValue() {
      this.lawIndex = this.sortByColumn();
    },
  },
  created() {
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
        this.updateSortValue("rank");
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
      // This finds the relevant data per key in the json ouput.
      // It takes in an integer or string value of the category, e.g., 1 or "1.2".
      // If the key exists in the json output, it reurns the property value
      // and if not, it returns an empty string.

      const foundArr = arr.find((obj) => obj.Cat === String(value));
      return foundArr[key] || "";
    },
    formatLawIndex(arr) {
      // We need to format our json output so that it's readable and more structured.
      // This helps us populate the table easily.

      // The goal is to sort json output per country
      // so that each array element contains all relvant info about the specified country.

      const countries = Object.keys(arr[0]).filter(
        (key) =>
          key !== "Cat" &&
          key !== "Criterion" &&
          key !== "Comments" &&
          key !== "points"
      );
      const unsortedLawIndex = countries.map((country, index) => {
        const dataPerCountry = {
          location: country,
          legislation: this.formatAccordionData(arr, "1.", country),
          caseLaw: this.formatAccordionData(arr, "2.", country),
          gazette: this.formatAccordionData(arr, "3.", country),
        };

        const totalPoints =
          dataPerCountry.legislation.points +
          dataPerCountry.caseLaw.points +
          dataPerCountry.gazette.points;

        dataPerCountry.score =
          ((dataPerCountry.legislation.total +
            dataPerCountry.caseLaw.total +
            dataPerCountry.gazette.total) *
            100) /
          totalPoints;
        return dataPerCountry;
      });

      const sortedLawIndex = this.sortByColumn(unsortedLawIndex);

      return sortedLawIndex.map((countryData, index) => ({
        ...countryData,
        rank:
          index > 0 && sortedLawIndex[index - 1].score === countryData.score
            ? sortedLawIndex.findIndex(
                (lawIndex) => lawIndex.score === countryData.score
              ) + 1
            : index + 1,
      }));
    },
    formatAccordionData(arr, filterValue, country) {
      // We format each of legislation, case law and gazette to have its category,
      // website, criterion, comments and score peculiar to a specified country.

      const accordionData = {};
      accordionData.criteria = arr
        .filter((el, index) => {
          if (
            el.Cat.startsWith(filterValue) &&
            arr[index - 1].Cat === "Website"
          ) {
            accordionData.website = arr[index - 1][country];
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
      accordionData.total = parseInt(
        this.findDataPerKey(arr, parseInt(filterValue), country)
      );
      accordionData.points = parseInt(
        this.findDataPerKey(arr, parseInt(filterValue), "points")
      );
      accordionData.comments = this.findDataPerKey(
        arr,
        parseInt(filterValue),
        "Comments"
      );

      return accordionData;
    },
    updateSortValue(field) {
      let sortValue;
      if (this.currentSortValue[field] === "") {
        sortValue = "asc";
      } else if (this.currentSortValue[field] === "asc") {
        sortValue = "desc";
      } else if (this.currentSortValue[field] === "desc") {
        sortValue = "asc";
      }
      this.currentSortValue = {
        ...{
          rank: "",
          location: "",
          legislation: "",
          caseLaw: "",
          gazette: "",
          score: "",
        },
        [field]: sortValue,
      };
      this.displayArrow(field);
    },
    sortByColumn(arr = this.lawIndex) {
      const currentLawIndex = [...arr];

      Object.keys(this.currentSortValue).forEach((key) => {
        if (this.currentSortValue[key]) {
          currentLawIndex.sort((a, b) => {
            let fieldA, fieldB;
            if (key === "location") {
              fieldA = a[key] ? a[key].toLowerCase() : "";
              fieldB = b[key] ? b[key].toLowerCase() : "";
            } else if (key === "score" || key === "rank") {
              fieldA = a[key];
              fieldB = b[key];
            } else {
              fieldA = a[key].total;
              fieldB = b[key].total;
            }

            if (this.currentSortValue[key] === "asc") {
              return String(fieldA).localeCompare(String(fieldB), undefined, {
                numeric: true,
              });
            } else if (this.currentSortValue[key] === "desc") {
              return String(fieldB).localeCompare(String(fieldA), undefined, {
                numeric: true,
              });
            }
          });
        }
      });

      return currentLawIndex;
    },
    displayArrow(field) {
      if (this.currentSortValue[field] === "asc") return "<span>&uarr;</span>";
      else if (this.currentSortValue[field] === "desc")
        return "<span>&darr;</span>";
      else return "";
    },
    toggleAccordion(e, index) {
      const dropdown = document.querySelector(`#table-row__${index}`);

      if (dropdown.style.maxHeight) {
        dropdown.style.maxHeight = null;
        dropdown.parentNode.classList.remove('active')
      } else {
        dropdown.parentNode.classList.add('active')
        dropdown.style.maxHeight = dropdown.scrollHeight + "px";
        dropdown.style.minWidth = dropdown.parentElement.scrollWidth + "px";
      }
    },
  },
});

africanLawIndex.mount("#african-law-index");
