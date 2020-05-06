const express = require('express')
const cors = require('cors')
const { uuid, isuuid } = require('uuidv4')

const app = express()

app.use(cors())

// Nosso body utilizará JSON
app.use(express.json())

// Banco de dados fictício
const projects = []

function logRequests(request, response, next){
	const { method, url } = request

	const logLabel = `[${method.toUpperCase()}] ${url}`

	console.log(logLabel)

	next()
}

function validateProjectId(request, response, next){
	const { id } = request.params

	if(!isuuid(id)){
		return response.status(400).json({ error: 'Invalid project ID.' })
	}

	return next()
}

app.use(logRequests)


app.get('/projects', (request, response) => {
	return response.json(projects)
})

app.post('/projects', (request, response) => {
	const { title, owner } = request.body

	const project = { id: uuid(), title, owner }
	
	projects.push(project)

	return response.json(project)
})

app.put('projects/:id', validateProjectId, (request, response) => {
	const { id } = request.params
	const { title, owner } = request.body

	// Procura pelo índice do projeco colocado como Route Params (/:id)
	const projectIndex = projects.findIndex(project => project.id === id)
	
	// Caso não encontre, retornar um status 400 (algum erro no backend) e o JSON com o erro
	if (projectIndex < 0) {
		return response.status(400).json({ error:'Project not found' })
	}

	const project = {
		id,
		title,
		owner
	}

	projects[projectIndex] = project

	return response.json(project)
})

app.delete('projects/:id', validateProjectId, (request, response) => {
	const { id } = request.params

	const projectIndex = projects.findIndex(project => project.id === id)
	
	if (projectIndex < 0) {
		return response.status(400).json({ error:'Project not found' })
	}

	projects.splice(projectIndex, 1)
	
	// 204 quando temos uma resposta em branco
	return response.status(204).send()
})

app.listen(3333, () => {
  console.log('🚀 Back-end started!')
})