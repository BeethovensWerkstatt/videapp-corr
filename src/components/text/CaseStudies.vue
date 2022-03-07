<template>
  <div>
    <p v-if="$i18n.locale === 'en'">
      This page allows you to view all of Beethoven's works that are the subject of <em>Beethoven's Workshop</em>
      and to open the corresponding case studies. Access is therefore via work numbers. It should be noted that,
      as a general rule, only very limited excerpts from the respective works are thematised.
    </p>
    <p v-else>
      Über diese Seite haben Sie die Möglichkeit, sämtliche im Rahmen von <em>Beethovens Werkstatt</em>
      thematisierten Werke Beethovens zu sehen, und die jeweils zugehörigen Fallstudien zu öffnen.
      Der Zugriff erfolgt hier also über Werknummern. Dabei ist zu beachten,
      dass i.d.R. nur sehr begrenzte Ausschnitte aus den jeweiligen Werken thematisiert werden.
    </p>
  </div>
</template>
