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
        <v-spacer/>
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
              v-on="on"
              color="success"
              dark
              class="mb-2 rounded-0"
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
                      @click:append="rules.showPassword = !rules.showPassword"
                      :label="editedIndex !== -1 ? 'Новый Пароль' : 'Пароль'"
                      autocomplete="off"
                      counter="16"
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
              <v-spacer/>
              <v-btn
                @click="close"
                color="red darken-1"
                text
              >
                Отмена
              </v-btn>
              <v-btn
                @click="save"
                :color="`${buttonSaveCreate.color} darken-1`"
                :disabled="!rules.isValid"
                text
              >
                {{ buttonSaveCreate.title }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Подтверждение удаления  -->
        <!-- <v-dialog
          v-model="dialogDelete"
          max-width="500px"
        >
          <v-card>
            <v-card-title class="text-h5">
              Удалить этого пользователя?
            </v-card-title>
            <v-card-actions>
              <v-spacer/>
              <v-btn
                @click="closeDelete"
                color="blue darken-1"
                text
              >
                Отмена
              </v-btn>
              <v-btn
                @click="deleteItemConfirm"
                color="blue darken-1"
                text
              >
                OK
              </v-btn>
              <v-spacer/>
            </v-card-actions>
          </v-card>
        </v-dialog> -->
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
        @click="editItem(item)"
        medium
        class="mr-2"
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
        @click="getUsers"
        color="primary"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Component, Vue, getModule, Watch } from 'vue-property-decorator';
import UsersApi from '@/api/users.api';
import { store } from '@/store';
import { IUser } from '@/types/user';
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
    email: [
      (v: string) => !!v || 'Введите Email',
      (v: string) => /.+@.+/.test(v) || 'E-mail некорректный',
    ],
    passwordEdit: [
      (v: string) => !v
        || (v && v.length >= 5 && v.length <= 16)
        || 'Пароль должен быть больше 4 и меньше 16 символов',
    ],
    passwordCreate: [
      (v: string) => !!v || 'Введите пароль',
      (v: string) => (v && v.length >= 5 && v.length <= 16)
        || 'Пароль должен быть больше 4 и меньше 16 символов',
    ],
    name: [(v: string) => !!v || 'Поле не может быть пустым'],
  };

  get formTitle() {
    return this.editedIndex === -1
      ? 'Создать пользователя'
      : 'Редактировать пользователя';
  }

  get buttonSaveCreate() {
    return this.editedIndex === -1
      ? { title: 'Создать', color: 'green' }
      : { title: 'Сохранить', color: 'blue' };
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
      const users = await UsersApi.fetchAll();
      if (users) {
        this.users = users.map((user) => {
          return {
            ...user,
            createdAt: this.$formattingTimeDate(user.createdAt, ' '),
            updatedAt: this.$formattingTimeDate(user.updatedAt, ' '),
          };
        });
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
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
  }

  // deleteItem(item: any) {
  //   this.editedIndex = this.users.indexOf(item);
  //   this.editedItem = Object.assign({}, item);
  //   this.dialogDelete = true;
  // }

  deleteItemConfirm() {
    this.users.splice(this.editedIndex, 1);
    this.closeDelete();
  }

  close() {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    });
  }

  closeDelete() {
    this.dialogDelete = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
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
      const user = await UsersApi.create(this.editedItem);
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
        content: 'Пользователь успешно создан',
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
      const user = await UsersApi.update(this.editedItem);
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
        content: 'Пользователь успешно изменён',
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
