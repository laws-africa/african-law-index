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
          {{ Math.floor((access.legislation.total * 100) /
          access.legislation.points) }}%
        </div>
        <div class="law-index__table-column fifth-column__main">
          {{ Math.floor((access.caseLaw.total * 100) / access.caseLaw.points)
          }}%
        </div>
        <div class="law-index__table-column last-column__main">
          {{ Math.floor((access.gazette.total * 100) / access.gazette.points)
          }}%
        </div>
      </div>

      <div
        class="law-index__dropdown law-index__table-row"
        :id="'table-row__' + access_index"
      >
        <div class="law-index__table-column first-column__main"></div>
        <div class="law-index__table-column second-column__dropdown">
          <div>
            <div><b>{{ access.location }}</b></div>
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
                  Description
                </div>
                <div class="law-index__table-column last-column__main">
                  Points
                </div>
              </div>

              <div class="law-index__table-row">
                <div
                  class="law-index__table-column first-column__dropdown-content"
                >
                  Website
                </div>
                <div
                  class="law-index__table-column second-column__dropdown-content"
                >
                  <div
                    v-for="(website, website_index) in access.legislation.websites"
                    :key="website_index"
                  >
                    <a :href="updateUrl(website)" target="_blank">
                      {{ website}}
                    </a>
                  </div>
                </div>
                <div class="law-index__table-column last-column__main"></div>
              </div>

              <div
                class="law-index__table-row"
                v-for="(legislation, legislation_index) in access.legislation.criteria"
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
                  {{ access.legislation.total }} out of
                  {{access.legislation.points}}
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
                  Description
                </div>
                <div class="law-index__table-column last-column__main">
                  Points
                </div>
              </div>

              <div class="law-index__table-row">
                <div
                  class="law-index__table-column first-column__dropdown-content"
                >
                  Website
                </div>
                <div
                  class="law-index__table-column second-column__dropdown-content"
                >
                  <div
                    v-for="(website, website_index) in access.caseLaw.websites"
                    :key="website_index"
                  >
                    <a :href="updateUrl(website)" target="_blank">
                      {{ website}}
                    </a>
                  </div>
                </div>
                <div class="law-index__table-column last-column__main"></div>
              </div>
              <div
                class="law-index__table-row"
                v-for="(caseLaw, caseLaw_index) in access.caseLaw.criteria"
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
                  Description
                </div>
                <div class="law-index__table-column last-column__main">
                  Points
                </div>
              </div>

              <div class="law-index__table-row">
                <div
                  class="law-index__table-column first-column__dropdown-content"
                >
                  Website
                </div>
                <div
                  class="law-index__table-column second-column__dropdown-content"
                >
                  <div
                    v-for="(website, website_index) in access.gazette.websites"
                    :key="website_index"
                  >
                    <a :href="updateUrl(website)" target="_blank">
                      {{ website}}
                    </a>
                  </div>
                </div>
                <div class="law-index__table-column last-column__main"></div>
              </div>

              <div
                class="law-index__table-row"
                v-for="(gazette, gazette_index) in access.gazette.criteria"
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
</div>
`,
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
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTgqwpUPf25oEk6nge9wjiE8j8hNz1YNSq8xjdJT-soQkG4cfdy0eDpYcI-VFjk5Q1TkYk0UiUtEIdu/pub?gid=619601361&single=true&output=csv"
      );

      this.status = response.ok;

      if (response.ok) {
        const parsedData = Papa.parse(await response.text());
        this.lawIndex = this.formatLawIndex(parsedData.data);
        this.updateSortValue("rank");
        this.loading = false;
      } else {
        this.loading = false;
        console.log("HTTP-Error: " + response.status);
      }
    },
    findDataPerKey(arr, value, key) {
      // This finds the relevant data per key in the parsedData ouput.
      // It takes in an integer or string value of the category, e.g., 1 or "1.2".
      // If the key exists in the parsedData output, it returns the property value
      // and if not, it returns an empty string.

      const foundArr = arr.find((obj) => obj[0] === String(value));
      return foundArr[key] || "";
    },
    formatLawIndex(arr) {
      // We need to format our parsedData output so that it's readable and more structured.
      // This helps us populate the table easily.

      // The goal is to sort parsedData output per country
      // so that each array element contains all relevant info about the specified country.

      const countries = arr[0].filter(
        (key) =>
          key &&
          key !== "Cat" &&
          key !== "Criterion" &&
          key !== "Comments" &&
          key !== "points"
      );

      const unsortedLawIndex = [];
      for (let i=0; i < countries.length; i++) {
        const dataPerCountry = {
          location: countries[i],
          legislation: this.formatAccordionData(arr, "1.", countries[i]),
          caseLaw: this.formatAccordionData(arr, "2.", countries[i]),
          gazette: this.formatAccordionData(arr, "3.", countries[i]),
        };

        if (
          dataPerCountry.legislation &&
          dataPerCountry.caseLaw &&
          dataPerCountry.gazette
        ) {
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
          unsortedLawIndex.push(dataPerCountry);
        }
      }

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
      const countryIndex = arr[0].indexOf(country)
      accordionData.criteria = arr
        .filter((el, index) => {
          if (
            el[0] === "Website" &&
            arr[index + 1][0].startsWith(filterValue)
          ) {
            accordionData.websites =
              el[countryIndex + 1]?.split("|");
          }
          return el[0].startsWith(filterValue);
        })
        .map((value) => {
          const criterionData = {
            cat: value[0],
            criterion: value[1],
            comments: value[countryIndex],
            score: value[countryIndex + 1],
          };
          return criterionData;
        });
      accordionData.total = parseInt(
        this.findDataPerKey(arr, parseInt(filterValue), countryIndex + 1)
      );
      accordionData.points = parseInt(
        this.findDataPerKey(arr, parseInt(filterValue), 3)
      );
      accordionData.comments = this.findDataPerKey(
        arr,
        parseInt(filterValue),
        2
      );

      if (isNaN(accordionData.total)) return;
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
        dropdown.parentNode.classList.remove("active");
      } else {
        dropdown.parentNode.classList.add("active");
        dropdown.style.maxHeight = dropdown.scrollHeight + "px";
        dropdown.style.minWidth = dropdown.parentElement.scrollWidth + "px";
      }
    },

    updateUrl(url) {
      if (!url) return;
      if (url.startsWith("http") || url.startsWith("https")) return url;
      return "http://" + url;
    },
  },
});

africanLawIndex.mount("#african-law-index");
