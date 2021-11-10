<template>
  <v-data-table
    :headers="headers"
    :items="users"
    sort-by="calories"
    class="elevation-1"
  >
    <template
      id="1"
      v-slot:top
    >
      <v-toolbar flat>
        <v-toolbar-title>Пользователи</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        />
        <v-spacer />
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template
            id="2"
            v-slot:activator="{ on, attrs }"
          >
            <v-btn
              v-bind="attrs"
              :color="$accent"
              dark
              class="mb-2 rounded-0"
              v-on="on"
            >
              + Добавить
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <!-- Редактирование / создание -->
            <v-card-text>
              <v-container>
                <v-form
                  v-model="rules.isValid"
                  autocomplete="off"
                >
                  <v-row>
                    <v-text-field
                      v-model="editedItem.email"
                      :rules="rules.email"
                      required
                      label="Email"
                    />
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.lastName"
                      :rules="rules.name"
                      required
                      label="Фамилия"
                    />
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.firstName"
                      :rules="rules.name"
                      required
                      label="Имя"
                    />
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.password"
                      :rules="
                        editedIndex !== -1
                          ? rules.passwordEdit
                          : rules.passwordCreate
                      "
                      :append-icon="
                        rules.showPassword ? 'mdi-eye' : 'mdi-eye-off'
                      "
                      :type="rules.showPassword ? 'text' : 'password'"
                      :label="editedIndex !== -1 ? 'Новый Пароль' : 'Пароль'"
                      autocomplete="off"
                      counter="16"
                      @click:append="rules.showPassword = !rules.showPassword"
                    />
                  </v-row>
                  <v-row v-if="editedIndex !== -1">
                    <v-checkbox
                      v-model="editedItem.activated"
                      label="Действующий"
                      color="success"
                      hide-details
                    />
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="red darken-1"
                text
                @click="close"
              >
                Отмена
              </v-btn>
              <v-btn
                :color="`${buttonSaveCreate.color} darken-1`"
                :disabled="!rules.isValid"
                text
                @click="save"
              >
                {{ buttonSaveCreate.title }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <!-- Стилизация чекбокса -->
    <template
      id="3"
      v-slot:[`item.activated`]="{ item }"
    >
      <v-simple-checkbox
        v-model="item.activated"
        disabled
      />
    </template>

    <!-- Кнопка Редактировать / Удалить -->
    <template
      id="4"
      v-slot:[`item.actions`]="{ item }"
    >
      <v-icon
        medium
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <!-- <v-icon
        @click="deleteItem(item)"
        small
        color="red"
      >
        mdi-delete
      </v-icon> -->
    </template>
    <template
      id="5"
      v-slot:no-data
    >
      <v-btn
        color="primary"
        @click="getUsers"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { API } from '@/services/api';
import { store } from '@/store';
import { IUser } from '@/types/user';
import text from '@/utils/text';
import { emailRules, passwordEdit, passwordCreate, name } from '@/utils/validation';
/**
 * https://vuetifyjs.com/en/components/data-tables/#crud-actions
 */

@Component({})
export default class TeachersPage extends Vue {
  private dialog = false;
  dialogDelete = false;
  headers = [
    { text: 'id', align: 'start', sortable: true, value: 'id' },
    { text: 'Email', value: 'email' },
    { text: 'Фамилия', value: 'lastName', sortable: true },
    { text: 'Имя', value: 'firstName' },
    { text: 'Роль', value: 'role.description', sortable: true },
    { text: 'Действующий', value: 'activated', sortable: true },
    { text: 'Дата обновления', value: 'updatedAt', sortable: true },
    { text: 'Дата создания', value: 'createdAt', sortable: true },
    { text: 'Действия', value: 'actions', sortable: false },
  ];
  users: Array<IUser | any> = [];
  editedIndex = -1;
  editedItem = {
    id: 0,
    email: '',
    lastName: '',
    firstName: '',
    activated: true,
    password: '',
  };
  defaultItem = {
    id: 0,
    email: '',
    lastName: '',
    firstName: '',
    activated: true,
    password: '',
  };

  rules = {
    isValid: true,
    showPassword: false,
    email: emailRules,
    passwordEdit,
    passwordCreate,
    name,
  };

  get formTitle() {
    return this.editedIndex === -1
      ? text.user.titleCreate
      : text.user.titleEdit;
  }

  get buttonSaveCreate() {
    return this.editedIndex === -1
      ? { title: text.user.buttonCreate, color: this.$accent }
      : { title: text.user.buttonSave, color: 'blue' };
  }

  @Watch('dialog')
  dialogWatch(val: any) {
    return val || this.close();
  }

  @Watch('dialogDelete')
  dialogDeleteWatch(val: any) {
    return val || this.closeDelete();
  }

  created() {
    this.getUsers();
  }

  async getUsers() {
    try {
      const users = (await API.users.fetchAll()).data;
      if (users) {
        this.users = users.map((user) => ({
          ...user,
          createdAt: this.$formattingTimeDate(user.createdAt, ' '),
          updatedAt: this.$formattingTimeDate(user.updatedAt, ' '),
        }));
      }
    } catch (error: any) {
      store.notify.mutations.showNotify({
        type: 'error',
        content: error,
      });
    }
  }

  editItem(item: any) {
    this.editedIndex = this.users.indexOf(item);
    this.editedItem = { ...item };
    this.dialog = true;
  }

  deleteItemConfirm() {
    this.users.splice(this.editedIndex, 1);
    this.closeDelete();
  }

  close() {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = { ...this.defaultItem };
      this.editedIndex = -1;
    });
  }

  closeDelete() {
    this.dialogDelete = false;
    this.$nextTick(() => {
      this.editedItem = { ...this.defaultItem };
      this.editedIndex = -1;
    });
  }

  async save() {
    if (this.editedIndex > -1) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  async createUser() {
    try {
      const user = (await API.users.create(this.editedItem)).data;
      if (user) {
        this.users.push({
          ...user,
          createdAt: this.$formattingTimeDate(user.createdAt, ' '),
          updatedAt: this.$formattingTimeDate(user.updatedAt, ' '),
        });
      }
      this.close();
      store.notify.mutations.showNotify({
        type: 'success',
        content: text.user.updated,
      });
    } catch (error: any) {
      store.notify.mutations.showNotify({
        type: 'error',
        content: error,
      });
    }
  }

  async updateUser() {
    try {
      const user = (await API.users.update(this.editedItem)).data;
      if (user) {
        Object.assign(this.users[this.editedIndex], {
          ...user,
          createdAt: this.$formattingTimeDate(user.createdAt, ' '),
          updatedAt: this.$formattingTimeDate(user.updatedAt, ' '),
        });
      }
      this.close();
      store.notify.mutations.showNotify({
        type: 'success',
        content: text.user.created,
      });
    } catch (error: any) {
      store.notify.mutations.showNotify({
        type: 'error',
        content: error,
      });
    }
  }
}
</script>

<style lang="scss" scoped></style>
