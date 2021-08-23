#!/usr/bin/env bash
set -ex

FMS_DUMP_URL=https://dav.micy.in/backup_dbdumps/grapi/grapi.pgdump

if [ ! -f tmp/prod.pgdump ]
then
    wget $FMS_DUMP_URL -O tmp/prod.pgdump
fi

cat tmp/prod.pgdump | pg_restore --clean --no-owner -d grapi_development

