use std::{collections::HashMap, fs};

pub fn day01() {
	// Part 1.
	let contents = fs::read_to_string("../inputs/day01-input.txt")
		.expect("Should have been able to read the file");
	let pairs = contents.lines().map(|line| line.split("   ").collect::<Vec<&str>>());
	let mut column1 = pairs.clone().map(|pair| pair[0].parse::<i32>().unwrap()).collect::<Vec<i32>>();
	column1.sort();
	let mut column2 = pairs.clone().map(|pair| pair[1].parse::<i32>().unwrap()).collect::<Vec<i32>>();
	column2.sort();
	let mut distances = Vec::new();
	let mut i = 0;
	for value in &column1 {
		distances.insert(i, (*value - column2[i]).abs());
		i += 1;
	}
	let mut total_distance = 0;
	for distance in distances {
		total_distance += distance;
	}
	println!("Part 1: {total_distance}");

	// Part 2.
	let mut similarity_scores: HashMap<i32, i32> = HashMap::new();
	for value in &column1 {
		let count = column2.iter().filter(|b| **b == *value).count();
		*similarity_scores.entry(*value).or_default() += value * count as i32;
	}
	let total_score = similarity_scores.values().map(|value| *value).reduce(|a, b| a + b).unwrap();
	println!("Part 2: {total_score}");
}
