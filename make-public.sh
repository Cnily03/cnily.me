mv layouts/robots.public.txt layouts/robots.txt
rm -rf layouts/robots.private.txt

python make-public.py delete
python translate.py
npm run build:public

rm -rf CNAME.static.private
cp CNAME.static.public public/CNAME

rm -rf README.md
mv README.public.md README.md

rm -rf README.static.private.md
cp README.static.public.md public/README.md

cp LICENSE public/LICENSE

rm -rf *.bak
rm -rf .github
rm -rf make-public.py
rm -rf translate.py
rm -rf make-private.sh
rm -rf sync-static.sh
rm -rf deploy.sh

touch .public
mv .public public/.public