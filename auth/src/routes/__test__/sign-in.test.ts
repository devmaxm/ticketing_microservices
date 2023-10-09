import request from 'supertest';
import app from "../../app";

const correctData = {
    email: 'test@test.test',
    password: 'test'
}

const incorrectPasswordData = {
    email: 'test@test.test',
    password: 'test1234'
}


it('should success after signin', async () => {
    await request(app)
        .post('/api/users/signup')
        .send(correctData)
        .expect(201)

    const signInResponse = await request(app)
        .post('/api/users/signin')
        .send(correctData)
        .expect(200)

    expect(signInResponse.get('Set-Cookie')).toBeDefined()
    expect(signInResponse.body.user.id).toBeDefined()
    expect(signInResponse.body.user.email).toEqual(correctData.email)

})

it('should fail if user doesn\'t exist', async () => {
    const response = await request(app)
        .post('/api/users/signin')
        .send(correctData)
        .expect(400)

    expect(response.body.errors[0].message).toEqual("Invalid user data")
})

it('should fail if incorrect password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send(correctData)
        .expect(201)

    const signInResponse = await request(app)
        .post('/api/users/signin')
        .send(incorrectPasswordData)
        .expect(400)

    expect(signInResponse.body.errors[0].message).toEqual("Invalid user data")
})
