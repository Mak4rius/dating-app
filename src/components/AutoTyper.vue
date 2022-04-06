<template>
	      <p class="text-h2" text-color="white">
        	<vue-typer
			:text='["Arya Stark","Jon Snow","Daenerys Targaryen","Melisandre","Tyrion Lannister"]'
			:repeat='Infinity'
			:shuffle='false'
			initial-action='typing'
			:pre-type-delay='70'
			:type-delay='70'
			:pre-erase-delay='2000'
			:erase-delay='250'
			erase-style='select-all'
			:erase-on-complete='false'
			caret-animation='solid'
			></vue-typer>
      </p>
</template>