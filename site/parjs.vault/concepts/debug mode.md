#stage-0 %% Needs to be an article about checks Parjs does to tell if it’s running in production or debug mode, but right now I’m not sure what that even affects.%%
Parjs tries to detect whether it’s running in debug mode or in production. This affects stuff like:

- Optimizations
- How much information is collected
- Whether some combinators become noops
