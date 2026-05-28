<?php

it('can access the swagger documentation page', function () {
    $response = $this->get('/api/documentation');

    $response->assertStatus(200);
});

it('can access the generated api-docs json', function () {
    $response = $this->get('/docs');

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'openapi',
        'info' => [
            'title',
            'version',
        ],
        'paths',
    ]);
});
