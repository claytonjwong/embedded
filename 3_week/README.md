# Memory Types, Segments, and Management
* [Introduction to Memory Organization](#introduction-to-memory-organization)
* [Memory Architectures](#memory-architectures)
* [Memory Segments](#memory-segments)
* [Data Memory](#data-memory)
* [Special Keywords](#special-keywords)
* [The Stack](#the-stack)
* [The Heap](#the-heap)
* [Code Memory](#code-memory)

# Introduction to Memory Organization
![](docs/1_intro_bit_byte.png)

![](docs/1_intro_hierarchy.png)

![](docs/1_intro_memory_sizes.png)
* determine **memory footprint** before selecting a platform
* **FLASH**
	* program code
	* does *not* require power to retain information
	* ranges from 32 KB to 256 KB
* **RAM**
	* program data
	* requires power to retain information
	* ranges from 4 KB to 32 KB

![](docs/1_intro_memory_regions_linker1.png)

![](docs/1_intro_memory_regions_linker2.png)
* software to hardware translation
	* **linker file** describes memory regions to the build system
		* segment to sub-segment code to memory mapping
		* build a program with assigned memory addresses

![](docs/1_intro_controller_bus.png)
* **dedicated controller** needed to configure, read, and write data in **FLASH** and **RAM** memory
	* built into the microcontroller
	* communicates with the **CPU** via a **BUS**

* *Example: add external memory to your system*
	* **EEPROM:** electrically erasable programmable read-only memory
	* **GPIO:** general purpose input/output
	* **SPI:** serial peripheral interface

![](docs/1_intro_registers.png)
* **register** memory
	* *not* associated with the installed program
	* exists across multiple microcontroller entities
	* stores configuration and runtime information ( the state of a program )
* **general purpose** registers store operands for CPU instructions
* **special purpose** registers store program state
	* current instruction
	* program counter

![](docs/1_intro_memory_tradeoffs.png)

![](docs/1_intro_outcomes.png)

# Memory Architectures
![](docs/2_arch_model.png)

![](docs/2_arch_iface.png)

![](docs/2_arch_chars.png)

## Capacity
![](docs/2_arch_cap.png)

## Volatility
![](docs/2_arch_vol.png)

![](docs/2_arch_vol_endur1.png)

![](docs/2_arch_vol_endur2.png)

![](docs/2_arch_vol_endur3.png)

![](docs/2_arch_vol_endur4.png)

![](docs/2_arch_vol_endur5.png)

![](docs/2_arch_vol_endur6.png)

## Access
![](docs/2_arch_access1.png)

![](docs/2_arch_access2.png)

## Latency
![](docs/2_arch_latency.png)


# Memory Segments
![](docs/3_seg_linker.png)

![](docs/3_seg_platform1.png)

![](docs/3_seg_platform2.png)

* Compiler
	* platform independent
	* CPU target architecture dependent
* Linker
	* platform dependent

![](docs/3_seg_memmap.png)
* executable is mapped into physical memory (address space) via locating
* single address space, multiple segments / sub-segments

![](docs/3_seg_regs.png)

![](docs/3_seg_abi.png)
* ABI = application binary interface
	* compiler rules to perform translation from high-level language to architecture specific machine code
		* how to use the CPU and its registers

![](docs/3_seg_platform.png)

![](docs/3_seg_reg_def.png)

![](docs/3_seg_codedata1.png)

![](docs/3_seg_codedata2.png)

![](docs/3_seg_codedata3.png)

![](docs/3_seg_linker_subsegs.png)
* **.data**
	* stack
	* heap
	* data
	* bss = block started by symbol [[wikipedia.org](https://en.wikipedia.org/wiki/.bss)]
		* in embedded software, the bss segment is mapped into memory that is initialized to zero by the C run-time system before main() is entered
		* **"Better Save Space"** since the BSS segment only holds variables that don't have any value yet, it doesn't actually need to store the image of these variables
* **.code**
	* intvecs = interupt vectors
	* text
	* read-only data
	* bootloader


# Data Memory
A data segment contains many different segments that are used for different kinds of data, allocation of data
can be at compile time or at run time.  Certain parts of the data segment can be reused and others exist
for the lifetime of a program.  Scope and access to variables can also dictate the section of the data segment
where certain pieces of data exist. 

![](docs/4_data_seg_linker.png)

![](docs/4_data_memory_is.png)

![](docs/4_data_allocation.png)

![](docs/4_data_segments.png)

![](docs/4_data_examples.png)

![](docs/4_data_segments_linker1.png)

![](docs/4_data_segments_linker2.png)

![](docs/4_data_segments_linker3.png)

![](docs/4_data_characteristics.png)

![](docs/4_data_var_scope1.png)

![](docs/4_data_var_scope2.png)

![](docs/4_data_var_scope3.png)

![](docs/4_data_var_scope4.png)

![](docs/4_data_eeprom.png)
* external non-volatile memory can be connected to the microcontroller to retain data between power cycles

![](docs/4_data_init_vars.png)



# Special Keywords (Const, Extern, Static)

# The Stack

# The Heap

# Code Memory

