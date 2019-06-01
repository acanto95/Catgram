# Catgram

Catgram
====================

Instrucciones de uso
---------------------

* iniciar el env de python con : ". rkenv/bin/activate" para tener todas las dependencias de python
* Hacer el dump en una base local de preferencia de mysql con el archivo "structure.sql"
* Editar tanto el archivo app.py y migrations.py con la información de host ( si es local: localhost) , username y pass
* Correr el archivo de migraciónes para la base con "python migrations.py"
* Levantar la api con "python app.py"
* En otra terminal ir hacia el folder front/catgram-web y correr yarn start para levantar el front end
* Navegar hacia http://localhost:5000


Preguntas
---------------------
* ¿Si tuvieras que diseñar desde 0 una api similar a “thecatapi” desde 0, qué
tecnologías de AWS te podrían ayudar a implementarla?
  * Usaria la tecnologia de API gateway con Lambda para exponer los microservicios
  
* ¿En qué consistiría el deploy de esta aplicación en la arquitectura de AWS?
  * En crear todos los enpoints del servicio en un stage menor a producción, probar que sirvan y llevarlos a producción
  
* Ante los requerimientos cambiantes y actualizaciones futuras, ¿en qué
pasos consistiría actualizar la aplicación?
  * En crear nuevos endpoints en un deployment stage de prueba para ver su funcionalidad y de ahi llevarla hacia producción.
  
* ¿Cómo propondrías un ciclo de Integración continua (CI) o desarrollo
continuo (CD) para el futuro de la aplicación utilizando las tecnologías de
AWS?
  * Yo usaria Jenkins para la integración continua, para antes de que se despliegue se puedan realizar pruebas automaticamente
  
* ¿Si tienes un requerimiento sin cumplir, explicar en qué consite la solución
que pensaste pero no pudiste implementar y la razón por la cuál no se
pudo.
  * El requerimiento que me falto fueron las pruebas con Selenium, ya que en tiempo no me lo permitio al igual que la falta de experiencia con esa tecnologia. Al igual que no sabia si implementar una base de datos a nivel cache como lo es Redis, ya que solo hago peticiones a la base de datos para tener una referencia en el front end al momento de agregar o quitar imagenes favoritas



