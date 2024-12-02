use std::fs;

pub fn day01() {
	// Part 1.
	let contents = fs::read_to_string("src/inputs/day01-input.txt")
		.expect("Should have been able to read the file");
	let pairs = contents.lines().map(|line| line.split("   ").collect::<Vec<&str>>());
	let mut column1 = pairs.clone().map(|pair| pair[0].parse::<i32>().unwrap()).collect::<Vec<i32>>();
	column1.sort();
	let mut column2 = pairs.clone().map(|pair| pair[1].parse::<i32>().unwrap()).collect::<Vec<i32>>();
	column2.sort();
	let mut distances = Vec::new();
	let mut i = 0;
	for value in column1 {
		distances.insert(i, (value - column2[i]).abs());
		i += 1;
	}
	let mut total_distance = 0;
	for distance in distances {
		total_distance += distance;
	}
	println!("Part 1: {total_distance}");
}
