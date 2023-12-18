# My Project

A (fairly trivial) DNS over HTTPS (RFC 8484) proxy, written in Node.js/TypeScript/express

## Workflow Status

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/dwd/dohproxy/main.yml?branch=main)

## Install Dependencies

`npm i`

## Running the Project

`npm run start` for production, `npm run dev` for development.

## Test

Although I could have written a test suite for this, the actual code is fairly trivial in isolation - in fact the obvious tests wouldn't have caught the bugs I've had, since they were misunderstandings in how DNS over TCP worked, or misunderstandings of the need for HTTP/2, and an overlap bug due to the trivial nature of the code.

Instead, the simplest way to check the entire deployment is by hitting it with `dig`, and prodding the `/healthcheck` endpoint.

If the healthcheck endpoint works, but dig fails with a TLS error, check that HTTP/2 is supported by your nginx (or whatever) install.

## CI

This project deploys master (and yes, I should rename that) to my own servers, tests it, and then deploys it live.

Ordinarily, for something I'd consider critical, I don't wait for an explicit tag - this is because it can be tested fairly well on a test deploy.

## Contributing

PRs welcome.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details