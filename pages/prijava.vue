<script setup lang="ts">
import type { Prijava } from "@/generated/prisma";
import type { FormSubmitEvent } from '@nuxt/ui'
import { DateFormatter, CalendarDate } from '@internationalized/date'

const df = new DateFormatter("sl-SI", {
  dateStyle: "medium",
});

const datumRojstva = shallowRef<CalendarDate | null>(new CalendarDate(new Date().getUTCFullYear(), new Date().getUTCMonth()+1, new Date().getUTCDate()));
const koledarOdprt = ref(false);

const state = ref({
  imePriimek: "",
  email: "",
  telefon: "",
  datumRojstva: null as CalendarDate | null,
  izkusenost: undefined,
  proizvajalciLoparjev: [],
  objavaSlik: false,
  obdelavaPodatkov: false,
  dodatno: {} as Record<string, string>,
});

const nivojiIzkusenosti = [
  { label: "Začetnik", value: "ZACETNIK" },
  { label: "Rekreativec", value: "REKREATIVEC" },
  { label: "Tekmovalec", value: "TEKMOVALEC" },
];

const predlogiDodatno = [
  "Prehrambene posebnosti",
  "Najljubši igralec",
  "Najljubši trener",
  "Trenutni lopar",
];

const dodatnoOdprto = ref(false);
const novoDodatno = ref("");
const dodajDodatno = () => {
  if (novoDodatno.value) {
    state.value.dodatno[novoDodatno.value] = "";
    novoDodatno.value = "";
    dodatnoOdprto.value = false;
  }
};

const errorMessage = ref("");
const prijava = ref<Prijava | null>(null);
const handleSubmit = (event: FormSubmitEvent<typeof state.value>) => {
  errorMessage.value = "";
  $fetch<Prijava>("/api/prijava", {
    method: "POST",
    body: {
      ...event.data,
      datumRojstva: event.data.datumRojstva?.toDate("UTC").toJSON(),
    },
  }).then((data) => {
    console.log(data);
    prijava.value = data;
  }).catch((error) => {
    console.error(error);
    errorMessage.value = error.data?.message;
  });
};
</script>
<template>
  <UContainer>
    <div class="flex flex-col gap-8 my-10 max-w-md mx-auto">
      <h2 class="text-2xl font-bold text-center">Prijava na poletno badmintonsko šolo 🏸</h2>
      <UForm v-if="!prijava" :state="state" class="flex flex-col gap-5" @submit="handleSubmit">
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Ime in priimek" name="imePriimek" required>
            <UInput v-model="state.imePriimek" class="w-full" placeholder="Janez Novak" />
          </UFormField>
          <UFormField label="Email" name="email" required>
            <UInput v-model="state.email" class="w-full" placeholder="janez.novak@gmail.com" />
          </UFormField>
          <UFormField label="Telefon" name="telefon">
            <UInput v-model="state.telefon" class="w-full" placeholder="041 123 456" />
          </UFormField>
          <UFormField label="Datum rojstva" name="datumRojstva" required>
            <UPopover v-model:open="koledarOdprt">
              <UButton class="cursor-pointer w-full text-left" color="neutral" variant="outline" icon="i-lucide-calendar">
                {{ state.datumRojstva ? df.format(state.datumRojstva.toDate("UTC")) : 'Izberi datum' }}
              </UButton>
              <template #content>
                <UCalendar v-model="datumRojstva" class="p-2" @update:model-value="() => { state.datumRojstva = datumRojstva; koledarOdprt = false; }" />
              </template>
            </UPopover>
          </UFormField>
          <UFormField label="Izkušenost" name="izkusenost" required>
            <USelect v-model="state.izkusenost" class="w-full" :items="nivojiIzkusenosti" placeholder="Izberi nivo izkušenosti" />
          </UFormField>
        </div>
        <UFormField label="Proizvajalci loparjev" name="proizvajalciLoparjev">
          <UInputTags v-model="state.proizvajalciLoparjev" class="w-full" placeholder="Vnesi najljubše proizvajalce loparjev" :duplicate="false" delimiter="," add-on-paste add-on-tab add-on-blur />
        </UFormField>
        <UFormField name="dodatno" class="mt-2">
          <div class="flex flex-col gap-3">
            <div class="flex gap-4 items-center">
              <p class="font-medium text-default">Povej nam še nekaj o sebi</p>
              <UPopover v-model:open="dodatnoOdprto">
                <UButton color="primary" variant="outline" icon="i-lucide-plus" size="xs" />
                <template #content>
                  <div class="flex gap-2 p-3">
                    <UInput v-model="novoDodatno" class="w-sm" placeholder="Kaj boš povedal o sebi?" @keydown.enter="dodajDodatno" />
                    <UButton color="primary" variant="outline" icon="i-lucide-plus" size="xs" @click="dodajDodatno" />
                  </div>
                </template>
              </UPopover>
            </div>
            <div class="flex flex-wrap gap-2">
              <UBadge v-for="predlog in predlogiDodatno.filter(predlog => !(predlog in state.dodatno))" :key="predlog" color="primary" variant="subtle" size="sm" class="cursor-pointer" @click="() => state.dodatno[predlog] = ''">{{ predlog }}</UBadge>
            </div>
            <div class="flex flex-col gap-2 divide-y divide-primary/30">
              <div v-for="dodaten in Object.keys(state.dodatno)" :key="dodaten" class="flex gap-2 items-center pb-2">
                <UBadge color="primary" variant="soft" size="md">{{ dodaten }}</UBadge>
                <UInput v-model="state.dodatno[dodaten]" class="w-full" placeholder="Vnesi dodatne informacije" />
                <UButton color="error" variant="outline" icon="i-lucide-trash" size="xs" @click="() => { delete state.dodatno[dodaten]; } " />
              </div>
            </div>
          </div>
        </UFormField>
        <UFormField name="objavaSlik" class="mt-3">
          <UCheckbox v-model="state.objavaSlik" label="Strinjam se z objavo slik, na katerih se pojavim, na spletni strani in socialnih medijih kluba." />
        </UFormField>
        <UFormField name="obdelavaPodatkov">
          <UCheckbox v-model="state.obdelavaPodatkov" label="Strinjam se z obdelavo mojih osebnih podatkov v namene prijave in udeležbe na poletni badmintonski šoli." required />
        </UFormField>
        <div v-if="errorMessage" class="flex w-full text-error">
          <p class="text-sm">{{ errorMessage }}</p>
        </div>
        <UButton class="mx-auto mt-5 cursor-pointer" type="submit">Prijavi se</UButton>
      </UForm>
      <div v-else class="flex flex-col gap-5 text-success">
        <p class="text-center">Vaša prijava je bila uspešna.</p>
      </div>
    </div>
  </UContainer>
</template>
