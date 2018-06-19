# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.2] - 2018-06-19
### Added
- option.reload which reloads (delete and record again) the tape if set to true
### Changed
### Removed

## [2.0.1] - 2018-06-19
### Added
- option.refresh which refreshs (remove from requrie.cache) the tape if set to true
### Changed
### Removed

## [2.0.0] - 2018-06-15
### Added
- json-bigint for json response body parsing in case that there are big integers which JSON cannot handle itself
- Added the possebility to pass the `maxredirects=0` header to custom requests in order to suppress redirects only for certain requests
### Changed
- Fixed: Array headers in template are now correct formatted
### Removed

## [1.4.5] - 2018-06-11
### Added
### Changed
- Fixed: Sanitize backslash in content body
- Fixed: Decompress human readable data
- Updated dependencies
### Removed

## [1.4.4] - 2018-04-11
### Added
### Changed
- Fixed pd bug for buffered response
### Removed

## [1.4.3] - 2018-03-27
### Added

### Changed
- Fixed template rendering issue where we tried to call `replace` on arrays

### Removed

## [1.4.2] - 2018-03-26
### Added
- Examples

### Changed
- Fix data stream handling and invalid error handling

### Removed


## [1.4.1] - 2018-03-22
### Added
- Dependencies updates
- Added .github templates and CHANGELOG.md

### Changed

### Removed

[Unreleased]: https://github.com/mbaertschi/node-vcr/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/mbaertschi/node-vcr/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/mbaertschi/node-vcr/compare/v1.4.5...v2.0.0
[1.4.5]: https://github.com/mbaertschi/node-vcr/compare/v1.4.4...v1.4.5
[1.4.4]: https://github.com/mbaertschi/node-vcr/compare/v1.4.3...v1.4.4
[1.4.3]: https://github.com/mbaertschi/node-vcr/compare/v1.4.2...v1.4.3
[1.4.2]: https://github.com/mbaertschi/node-vcr/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/mbaertschi/node-vcr/compare/v1.2.0...v1.4.1
