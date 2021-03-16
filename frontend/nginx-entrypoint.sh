#!/bin/sh

ENV_FILE=$(find /usr/share/nginx/html/env.*.js)
TEMPLATE="$ENV_FILE.template"

if [ ! -f "$TEMPLATE" ]
then
    cp "$ENV_FILE" "$ENV_FILE.template"
fi

envsubst < "${TEMPLATE}" > "${ENV_FILE}"

[ -z "$@" ] && nginx-debug -g 'daemon off;' || $@