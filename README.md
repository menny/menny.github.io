# Menny Even-Danan Personal Page

This repository includes my web-pages.

Visit http://menny.github.io to enjoy it.

### Running locally

Make sure you have Ruby and cmake installed. On macOS:

```
brew install ruby
```
and
```
brew install cmake
```

Make sure the newly installed `ruby` is accessible in the `PATH`: 

```
echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.zshrc
```

And restart your shell.
Install all dependencies locally:

```
bundle install
```
and
```
gem install bundler:2.1.4
```

and serve:
```
bundle exec jekyll serve
```

Point your browser to http://127.0.0.1:4000
