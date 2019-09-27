<template>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          color="secondary"
          v-on="on"
          rounded
        >
          {{label}}
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="picked(item)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
</template>

<script>
export default {
    props: {
        'url': { type: String, default: ''},
        'label': { type: String, default: 'Share' }
    },
    data: () => ({
      items: [
        { title: 'Twitter' , 'url': 'https://twitter.com/intent/tweet?text=Take%20a%20look%20at%20this%20school&amp;url='},
        { title: 'Facebook', 'url': 'https://www.facebook.com/sharer/sharer.php?u=' },
        { title: 'Email', 'url': 'mailto:?subject=Take%20a%20look%20at%20this%20school&amp;body=I%20found%20this%20on%20collegescorecard.ed.gov.%20Take%20a%20look%3A%0A%0A' }, 
        { title: 'LinkedIn', 'url': 'https://www.linkedin.com/shareArticle?mini=true&url='},
      ],
    }),
    methods:{
        picked(item){
            window.open(item.url+this.url, "_blank"); 
        }
    }

}
</script>

<!--
            <div class="school-share-wrapper">
              <div
                class="button button-share"
                data-share-button
                tabindex="0"
                role="button"
                onclick="void(0)"
              >
                <span class="top xaxis content">Share this School</span>
                <ul class="social-share-list bottom xaxis content">
                  <li class="social-item">
                    <a
                      data-href="{url}"
                      data-bind="school_share_link_twt"
                      data-social="Twitter"
                      title="Share on Twitter"
                      target="_blank"
                    >
                      <i class="fa fa-twitter"></i>
                      <span class="sr-only">Share on Twitter</span>
                    </a>
                  </li>
                  <li class="social-item">
                    <a
                      data-href=""
                      data-bind="school_share_link_fb"
                      title="Share on Facebook"
                      data-social="Facebook"
                      target="_blank"
                    >
                      <i class="fa fa-facebook"></i>
                      <span class="sr-only">Share on Facebook</span>
                    </a>
                  </li>
                  <li class="social-item">
                    <a
                      data-href="}"
                      data-bind="school_share_link_mail"
                      data-social="Email"
                      title="Share via Email"
                    >
                      <i class="fa fa-envelope"></i>
                      <span class="sr-only">Share via Email</span>
                    </a>
                  </li>
                  <li class="social-item">
                    <a
                      data-href=""
                      data-bind="school_share_link_li"
                      data-social="LinkedIn"
                      title="Share on LinkedIn"
                      target="_blank"
                    >
                      <i class="fa fa-linkedin"></i>
                      <span class="sr-only">Share on LinkedIn</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>-->