import request from 'supertest';
import app from "../../app";

const correctData = {
    email: 'test@test.test',
    password: 'test'
}

const incorrectPasswordData = {
    email: 'test@test.test',
    password: 'tes'
}

const incorrectEmailData = {
    email: 'test',
    password: 'test1234'
}

it('should success after signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send(correctData)
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
    expect(response.body.user.id).toBeDefined()
    expect(response.body.user.email).toEqual(correctData.email)

})

it('should fail if incorrect password', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send(incorrectPasswordData)
        .expect(400)

    expect(response.body.errors[0].message).toEqual("Password must be between 4 and 20 characters")
})

it('should fail if incorrect email', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send(incorrectEmailData)
        .expect(400)

    expect(response.body.errors[0].message).toEqual("Provide correct email")
})

it('should fail if user exists', async () => {
    await request(app)
        .post('/api/users/signup')
        .send(correctData)
        .expect(201)

    const response = await request(app)
        .post('/api/users/signup')
        .send(correctData)
        .expect(400)

    expect(response.body.errors[0].message).toEqual("User with this email is already exists")
})
