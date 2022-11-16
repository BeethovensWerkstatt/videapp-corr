<template>
  <div class="modules">
    <h1>Module</h1>
    <div class="module" v-for="mod in modules" :key="'mod_' + mod.n" :class="{ inactive: mod.inactive }">
      <h2>
        <span class="num">{{ mod.label }}</span>
        <span class="title">{{ mod.title }}</span>
      </h2>
      <div class="info">
        <div v-if="mod.n === 1">
          Das zwei Jahre (2014–16) umfassende erste Modul beschäftigte sich mit
          Variantenbildungen in ausgewählten Werken Beethovens. Ziel war die Erfassung,
          Erforschung und Beschreibung sowie die
          digitale Darstellung von Beethovens Kompositionsstrategien unter
          verschiedenen Fragestellungen: Wie bzw. inwieweit kann man
          Schreibprozesse und deren Zeitlichkeit rekonstruieren? Mit welchen
          Methoden der genetischen Textkritik lassen sich Variantenbildungen
          erfassen und darstellen? Lassen sich Variantenbildungen klassifizieren
          und Arbeitsroutinen erkennen? Gibt es gattungsbedingte Unterschiede
          bei der Variantenbildung?
          [<a class="moreLink" :href="mod.url" target="_blank">mehr</a>]
        </div>
        <div v-if="mod.n === 2">
          Das drei Jahre (2017–19) umfassende zweite Modul beschäftigte sich mit
          Beethoven als Bearbeiter eigener Werke. Dabei war das Ziel, die
          Originalfassungen und Beethovens Eigenbearbeitungen so zu verknüpfen, dass
          Fassungszusammenhänge und
          -differenzen möglichst unmittelbar sichtbar werden.
          [<a class="moreLink" :href="mod.url" target="_blank">mehr</a>]
        </div>
        <div v-if="mod.n === 3">
          Im dritten Modul (2020-22) wurden die spezifischen Formen der
          Textentwicklung während und nach der Übergabe eines Werktextes an den
          Verleger in den Blick genommen. Dazu wurden Beethovens Korrekturlisten
          und Revisionsverzeichnisse untersucht. Obwohl nur die beiden Fälle zu
          Beethovens Op.73 und Op.120 <em>vollständig</em> digital aufgearbeitet
          wurden, konnte für eine Vielzahl weiterer Werke eine
          <router-link :to="{ name: 'Monita' }">systematische
            Untersuchung</router-link> von Beethovens
          <a href="https://beethovens-werkstatt.de/glossary/monitum/" target="_blank" rel="noreferrer nofollow">Monita</a>
          vorgenommen werden.
          [<a class="moreLink" :href="mod.url" target="_blank">mehr</a>]
        </div>
        <div v-if="mod.n === 4">
          Im vierten Modul (ab 2022) soll mit Beethovens <em>Engelmann-Skizzenbuch</em>
          ein typisches Werkstattdokument von Beethoven untersucht und digital
          erschlossen werden. In diesem Skizzenbuch finden sich u.a. Entwürfe zu
          den Diabelli-Variationen Op.120 sowie zur Neunten Sinfonie Op.125.
          Als erstes ist die Facsimile Ansicht des "<router-link :to="{ name: 'Dokumente' }">Notirungsbuch K</router-link>" zugänglich.
          [<a class="moreLink" :href="mod.url" target="_blank">mehr</a>]
        </div>
        <div v-if="mod.n === 5">
          Im letzten Modul des Projekts (ab 2026) soll erstmals eine vollständige
          genetische Edition eines musikalischen Werks am Beispiel der Diabelli-Variationen
          erarbeitet werden. Diese Diese Edition soll gleichzeitig in eine traditionell konzipierte,
          digitale Edition des Werks sowie in eine Quellenedition des überlieferten Autographs eingebettet
          werden.
          [<a class="moreLink" :href="mod.url" target="_blank">mehr</a>]
        </div>
        <div class="workPills" v-if="!mod.inactive">
          <template v-for="(w, i) in module_works(mod)" :key="'pill_' + i">

            <span class="workPill" :class="{hasDossier: w.dossier}">
              <router-link
                v-if="w.route"
                :to="{ name: w.route, params: { id: w.id } }"
                :title="w.apptitle + '\r\n' + worktitle(w)"
                class="app"
              >{{ w.label }}</router-link>
              <a
                v-else-if="w.app"
                :href="w.app"
                target="_blank"
                :title="w.apptitle + '\r\n' + worktitle(w)"
                class="app"
              >{{ w.label }}</a>
              <span
                v-else
                :title="worktitle(w)"
              >{{ w.label }}</span>
            </span>

            <a :key="'dossier_' + i"
              v-if="w.dossier"
              :href="w.dossier"
              target="_blank"
              :title="'Dossier\r\n' + titlestring(w.dossiertitle || w.title)"
              class="dossier"
            ><document-symbol height="1rem"/></a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import n from '@/store/names'
import { workSorter } from '@/store/directory'
import DocumentSymbol from '@/components/symbols/DocumentSymbol.vue'

export default {
  name: 'Modules',
  components: {
    DocumentSymbol
  },
  computed: {
    ...mapGetters([n.getters.directory_modules, n.getters.directory_get_work]),
    modules () {
      const mods = this[n.getters.directory_modules]
      return mods
    },
    get_work () {
      const works = this[n.getters.directory_get_work]
      return (key) => {
        const work = works(key) || { label: key, title: '[?]' }
        // console.log('get work', key, work)
        return work
      }
    }
  },
  methods: {
    module_works (module) {
      if (module.works) {
        const works = module.works.map(w => this.get_work(w))
        return works.sort(workSorter)
      }
      return []
    },
    titlestring (s) {
      return s.replace(': ', ':\r\n')
    },
    worktitle (w) {
      return w.label + ', ' + w.title
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";

.modules {
  h1 {
    max-width: 80rem;
    margin: 2rem auto;
    // outline: 1px solid gray;
    // border-radius: 15px;
  }

  .module {
    max-width: 60rem;
    margin: 1rem auto 2.5rem;
    padding: 0 1rem;
    text-align: left;

    h2 {
      font-size: 1.2rem;
      font-weight: 900;

      .num:after {
        font-weight: 500;
        content: ': ';
      }
      .title {
        font-weight: 500;
      }
    }

    .workPills {
      margin-top: .5rem;

      .workPill {
        border: .5px solid $border-color;
        border-radius: .3rem;
        background-color: $background-flat;
        background: linear-gradient(180deg, lighten($background-flat, 10%) 0%, darken($background-flat, 5%) 100%);
        padding: .05rem .5rem;
        margin: 0 .5rem .5rem 0;

        &:hover {
          background-color: darken($background-flat, 10%);
        }

        a, a:hover, a:visited {
          color: $highlight-color;
          text-decoration: none;
          font-weight: 500;
        }

        &.hasDossier {
          border-radius: .3rem 0 0 .3rem;
          margin-right: 0;
          padding-right: .1rem;
        }
      }

      .dossier {
        border: .5px solid $border-color;
        border-left: none;
        border-radius: 0 .3rem .3rem 0;
        background-color: darken($background-flat, 10%);
        background: linear-gradient(180deg, darken($background-flat, 15%) 0%, darken($background-flat, 25%) 100%);
        padding: .05rem 0 .05rem .1rem;
        margin: 0 .5rem .5rem 0;
        position: relative;
        & > * {
          position: relative;
          left: -5px;
        }
      }
    }

  }

  .inactive {
    pointer-events: none;
    cursor: default;
    text-decoration: none;
    color: #aaaaaa;
  }
}
</style>
