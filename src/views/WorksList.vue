<template>
  <div class="hello">
    <h1>Werkliste</h1>
    <p>
      <table id="worksList" class="table">
        <thead>
          <tr>
            <th>Werk</th>
            <th>Modul</th>
            <th>Sonstwas</th>
          </tr>
        </thead>
        <tbody>
          <tr class="active">
            <td>Op. 111</td>
            <td>Modul 1</td>
            <td>trulala</td>
          </tr>
          <tr>
            <td>Op. 73</td>
            <td>Modul 3</td>
            <td><router-link to="/work/op73">Link</router-link></td>
          </tr>
        </tbody>
      </table>
    </p>
  </div>
</template>

<script>
/**
 * list of works component
 */
export default {
  name: 'WorksList'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#worksList {
  margin: 0 3rem 0;
  width: calc(100% - 6rem);
}
</style>
