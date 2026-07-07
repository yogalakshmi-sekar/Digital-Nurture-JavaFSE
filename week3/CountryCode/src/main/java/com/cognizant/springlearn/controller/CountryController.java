package com.cognizant.springlearn.controller;

import com.cognizant.springlearn.model.Country;
import org.springframework.web.bind.annotation.*;

@RestController
public class CountryController {

    @GetMapping("/country/{code}")
    public Country getCountry(@PathVariable String code) {

        if (code.equalsIgnoreCase("IN")) {
            return new Country("IN", "India");
        }

        else if (code.equalsIgnoreCase("US")) {
            return new Country("US", "United States");
        }

        else if (code.equalsIgnoreCase("JP")) {
            return new Country("JP", "Japan");
        }

        else {
            return new Country(code.toUpperCase(), "Country Not Found");
        }
    }
}