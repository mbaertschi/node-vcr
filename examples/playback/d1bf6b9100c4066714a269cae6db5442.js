const path = require('path')

// GET /users/mbaertschi/orgs

// user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36
// host: api.github.com
// connection: close

module.exports = function (req, res) {
  res.statusCode = 200

  res.setHeader('server', 'GitHub.com')
  res.setHeader('date', 'Mon, 26 Mar 2018 07:45:00 GMT')
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('content-length', '611')
  res.setHeader('connection', 'close')
  res.setHeader('status', '200 OK')
  res.setHeader('x-ratelimit-limit', '60')
  res.setHeader('x-ratelimit-remaining', '38')
  res.setHeader('x-ratelimit-reset', '1522052554')
  res.setHeader('cache-control', 'public, max-age=60, s-maxage=60')
  res.setHeader('vary', 'Accept')
  res.setHeader('etag', '"e69b62a3ca206eb75e24a50ee77e9484"')
  res.setHeader('x-github-media-type', 'github.v3; format=json')
  res.setHeader('access-control-expose-headers', 'ETag, Link, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval')
  res.setHeader('access-control-allow-origin', '*')
  res.setHeader('strict-transport-security', 'max-age=31536000; includeSubdomains; preload')
  res.setHeader('x-frame-options', 'deny')
  res.setHeader('x-content-type-options', 'nosniff')
  res.setHeader('x-xss-protection', '1; mode=block')
  res.setHeader('referrer-policy', 'origin-when-cross-origin, strict-origin-when-cross-origin')
  res.setHeader('content-security-policy', 'default-src \'none\'')
  res.setHeader('x-runtime-rack', '0.019161')
  res.setHeader('x-github-request-id', 'C0D0:6FC1:3060A12:7923159:5AB8A4FB')

  res.setHeader('x-node-vcr-tape', path.basename(__filename, '.js'))

  res.write(Buffer.from(`[
  {
    "login": "zebbra",
    "id": 13148514,
    "url": "https://api.github.com/orgs/zebbra",
    "repos_url": "https://api.github.com/orgs/zebbra/repos",
    "events_url": "https://api.github.com/orgs/zebbra/events",
    "hooks_url": "https://api.github.com/orgs/zebbra/hooks",
    "issues_url": "https://api.github.com/orgs/zebbra/issues",
    "members_url": "https://`, 'utf-8'))
  res.write(Buffer.from(`api.github.com/orgs/zebbra/members{/member}",
    "public_members_url": "https://api.github.com/orgs/zebbra/public_members{/member}",
    "avatar_url": "https://avatars3.githubusercontent.com/u/13148514?v=4",
    "description": ""
  }
]
`, 'utf-8'))
  res.end()

  return __filename
}
