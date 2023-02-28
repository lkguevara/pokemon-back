

# **POKEMON** | Proyecto Individual

## **📌 OBJETIVOS**

-  Construir una Single Page Application utlizando las tecnologías: **React**, **Redux**, **Node**, **Express** y **Sequelize**.
-  Poner en práctica recursos básicos de estilos y diseño (UX : UI).
-  Afirmar y conectar los conceptos aprendidos en la carrera.
-  Aprender mejores prácticas.
-  Aprender y practicar el workflow de GIT.
-  Utilizar y practicar testing.

<br />

---

<br />

## **📖 ENUNCIADO GENERAL**

La idea de este proyecto es construir una aplicación web a partir de la API [**pokeapi**](https://pokeapi.co/) en la que se pueda:

-  Buscar pokemones.
-  Visualizar la información de los pokemones.
-  Filtrarlos.
-  Ordenarlos.
-  Crear nuevos pokemones.

⚠️ Para las funcionalidades de filtrado y ordenamiento NO se puede utilizar los endpoints de la API externa que ya devuelven los resultados filtrados u ordenados.

### **Únicos end-points que se pueden utilizar**

-  [**PokeApi**](https://pokeapi.co/api/v2/pokemon)
-  **Por id**: _"https://pokeapi.co/api/v2/pokemon/{id}"_
-  **Por nombre**: _"https://pokeapi.co/api/v2/pokemon/{name}"_
-  **Por tipo**: _"https://pokeapi.co/api/v2/type"_

<br />

---

## **📁 INSTRUCCIONES**

<br />

### **🖱 BASE DE DATOS**

Deberás crear dos modelos para tu base de datos. Una será para los pokemones y la otra será para los tipos de pokemones (pueden llevar el nombre que tu quieras). La relación entre ambos modelos debe ser de muchos a muchos. A continuación te dejamos las propiedades que debe tener cada modelo. Aquellas marcadas con un asterísco son obligatorias.

**📍 MODELO 1 | Pokemons**

-  ID. \*
-  Nombre. \*
-  Imagen. \*
-  Vida. \*
-  Ataque. \*
-  Defensa. \*
-  Velocidad.
-  Altura.
-  Peso.

<br />

**📍 MODELO 2 | Type**

-  ID. \*
-  Nombre. \*

<br />

---

<br />

### **🖱 BACK-END**

Para esta parte deberás construir un servidor utilizando **NodeJS** y **Express**. Tendrás que conectarlo con tu base de datos mediante **Sequelize**.

Tu servidor deberá contar con las siguientes rutas:

#### **📍 GET | /pokemons**

-  Obtiene un arreglo de objetos, donde cada objeto es un pokemon con su información.

#### **📍 GET | /pokemons/:idPokemon**

-  Esta ruta obtiene el detalle de un pokemon específico. Es decir que devuelve un objeto con la información pedida en el detalle de un pokemon.
-  El pokemon es recibido por parámetro (ID).
-  Tiene que incluir los datos del tipo de pokemon al que está asociado.
-  Debe funcionar tanto para los pokemones de la API como para los de la base de datos.

#### **📍 GET | /pokemons/name?="..."**

-  Esta ruta debe obtener todos aquellos pokemons que coinciden con el nombre recibido por query.
-  Debe poder buscarlo independientemente de mayúsculas o minúsculas.
-  Si no existe el pokemon, debe mostrar un mensaje adecuado.
-  Debe buscar tanto los de la API como los de la base de datos.

#### **📍 POST | /pokemons**

-  Esta ruta recibirá todos los datos necesarios para crear un pokemon y relacionarlo con sus tipos solicitados.
-  Toda la información debe ser recibida por body.
-  Debe crear un pokemon en la base de datos, y este debe estar relacionado con sus tipos indicados (al menos uno).

#### **📍 GET | /types**

-  Obtiene un arreglo con todos los tipos de pokemones.
-  En una primera instancia, cuando la base de datos este vacía, deberás guardar todos los tipos que encuentres en la API.
-  Estos deben ser obtenidos de la API (se evaluará que no haya hardcodeo). Luego de obtenerlos de la API, deben ser guardados en la base de datos para su posterior consumo desde allí.

<br />

