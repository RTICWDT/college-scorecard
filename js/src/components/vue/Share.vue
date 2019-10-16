<template>
  <span>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
          <v-btn
          color="secondary"
          v-on="on"
          rounded
          :small="small"
          class='d-none d-sm-inline'
        >
          <v-icon x-small class='mr-2'>fas fa-share</v-icon> {{label}}
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
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
          <v-btn
          color="secondary"
          v-on="on"
          rounded
          fab 
          :x-small="small"
          class='d-inline d-sm-none'
        >
          <v-icon x-small>fas fa-share</v-icon>
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
  </span>
</template>

<script>
export default {
    props: {
        'url': { type: String, default: ''},
        'label': { type: String, default: 'Share' },
        'small': { type: Boolean, default: false }
    },
    computed: {
      items(){
        return [
            { title: 'Twitter' , 'url': 'https://twitter.com/intent/tweet?text='+this.sentence+'&amp;url='},
            { title: 'Facebook', 'url': 'https://www.facebook.com/sharer/sharer.php?u=' },
            { title: 'Email', 'url': 'mailto:?subject='+this.sentence+'&amp;body=I%20found%20this%20on%20collegescorecard.ed.gov.%20Take%20a%20look%3A%0A%0A' }, 
            { title: 'LinkedIn', 'url': 'https://www.linkedin.com/shareArticle?mini=true&url='},
        ];
      },
      sentence(){
        let sentence = '';
        switch(this.label.toLowerCase())
        {
          case 'share':
            sentence = 'Take a look at this school search from the College Scorecard:';
          break;
          case 'share this comparison':
            sentence = 'Take a look at this school comparison on the College Scorecard:';
          break;
          case 'share this school':
            sentence = 'Take a look at this school on the College Scorecard:';
          break;
        }
        return sentence;
      }
    },
    methods:{
        picked(item){
            window.open(item.url+this.url, "_blank"); 
        }
    }

}
</script>