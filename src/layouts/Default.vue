<template>
  <div class=""><slot /></div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>
