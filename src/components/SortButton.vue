<template>
  <div class="text-center">
    <v-menu offset-y>
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          color="transparent"
          v-bind="attrs"
          tile
          large
          v-on="on"
        >
          <v-icon class="mr-2">mdi-sort-variant</v-icon>
          {{ selected !== null ? items[selected].title : "Упорядочить" }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item-group v-model="selected">
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
          >
            <v-list-item-title v-text="item.title" />
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class SortButton extends Vue {
  selected: null | number = null;
  items = [
    { title: 'Сначала новые', value: 'DESC' },
    { title: 'Сначала старые', value: 'ASC' },
  ];

  @Watch('selected')
  select(val: number, old: number) {
    if (val === undefined) this.selected = old;
    else this.$emit('change', this.items[val]?.value);
  }
}
</script>
