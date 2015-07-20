all: national_stats.yaml

national_stats.yaml:
	@if [ -z "$(DATA_CSV)" ]; then \
		echo "You must set the DATA_CSV environment variable."; \
		exit 1; \
	fi
	cat $(DATA_CSV) | node stats.js > $@

clean:
	rm national_stats.yaml
