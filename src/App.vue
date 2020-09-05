<template>
  <div id="app">
    <header>
      <div class="application_title">
        Annotation tool
      </div>
    </header>

    <nav>
      <router-link :to="{ name: 'home', params: {} }">
        Collections
      </router-link>

      <template v-if="$route.params.collection">
        <span>></span>
        <router-link :to="{ name: 'collection', params: {collection: $route.params.collection} }">
          {{$route.params.collection}}
        </router-link>
      </template>

      <template v-if="$route.params.entry_id">
        <span>></span>
        <span>
          {{$route.params.entry_id}}
        </span>
      </template>

      <div class="spacer"/>


    </nav>

    <main>
      <router-view/>
    </main>

    <footer>
      Annotation tool, Maxime MOREILLON
    </footer>
  </div>
</template>

<style>
body {
  margin: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}




header {
  font-size: 120%;
  background-color: #444444;
  color: white;
  padding: 15px;
}


nav {
  padding: 15px;
  font-weight: bold;
  display: flex;
  align-items: center;
}
nav a {
  color: currentColor;
  text-decoration: none;


}

nav a:hover {
  color: #c00000;
}

nav > * {
  margin-right: 15px;
}


main {
  flex-grow: 1;
  margin: 0 15px;
}

footer {
  margin-top: 1em;
  margin-left: 1em;
  margin-right: 1em;
  border-top: 1px solid #dddddd;
  padding: 1em;
  text-align: center;
}

.spacer {
  flex-grow: 1;
}

.loader_container {
  text-align: center;
  font-size: 200%;
}

.about {
  font-size: 120%;
}
</style>
